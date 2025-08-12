import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { funding: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status && ['PLANNING', 'ACTIVE', 'COMPLETED', 'SUSPENDED'].includes(status)) {
      where.status = status
    }

    // Get projects with pagination
    const [projects, total] = await Promise.all([
      db.researchProject.findMany({
        where,
        include: {
          author: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          startDate: 'desc'
        },
        skip,
        take: limit
      }),
      db.researchProject.count({ where })
    ])

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { message: '获取研究项目失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, startDate, endDate, status, funding, budget } = body

    // Get user from token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: '未授权访问' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
    
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { message: '无效的令牌' },
        { status: 401 }
      )
    }

    // Validate required fields
    if (!title || !startDate) {
      return NextResponse.json(
        { message: '标题和开始日期为必填项' },
        { status: 400 }
      )
    }

    // Create project
    const project = await db.researchProject.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'PLANNING',
        funding,
        budget: budget ? parseFloat(budget) : null,
        authorId: decoded.userId
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: '研究项目创建成功',
      project
    })

  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { message: '创建研究项目失败' },
      { status: 500 }
    )
  }
}