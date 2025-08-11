import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    // Fetch all projects
    const projects = await db.researchProject.findMany({
      include: {
        author: {
          select: {
            name: true,
            username: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    return NextResponse.json(projects)

  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { message: '服务器错误' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { message: '未授权访问' },
        { status: 401 }
      )
    }

    const { title, description, startDate, endDate, status, funding, budget } = await request.json()

    if (!title || !startDate) {
      return NextResponse.json(
        { message: '标题和开始日期不能为空' },
        { status: 400 }
      )
    }

    // Create project
    const project = await db.researchProject.create({
      data: {
        title,
        description: description || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'PLANNING',
        funding: funding || null,
        budget: budget || null,
        authorId: (decoded as any).userId
      },
      include: {
        author: {
          select: {
            name: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json({
      message: '项目创建成功',
      project
    })

  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { message: '服务器错误' },
      { status: 500 }
    )
  }
}

// Middleware to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}