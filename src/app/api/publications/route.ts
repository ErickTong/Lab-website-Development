import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Build where clause for search
    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { abstract: { contains: search, mode: 'insensitive' } },
        { authors: { contains: search, mode: 'insensitive' } },
        { journal: { contains: search, mode: 'insensitive' } }
      ]
    } : {}

    // Get publications with pagination
    const [publications, total] = await Promise.all([
      db.publication.findMany({
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
          year: 'desc'
        },
        skip,
        take: limit
      }),
      db.publication.count({ where })
    ])

    return NextResponse.json({
      publications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching publications:', error)
    return NextResponse.json(
      { message: '获取出版物失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, abstract, authors, journal, year, volume, issue, pages, doi, url, pdfUrl } = body

    // Get user from token (you'll need to implement auth middleware)
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
    if (!title || !authors || !journal || !year) {
      return NextResponse.json(
        { message: '标题、作者、期刊和年份为必填项' },
        { status: 400 }
      )
    }

    // Create publication
    const publication = await db.publication.create({
      data: {
        title,
        abstract,
        authors,
        journal,
        year: parseInt(year),
        volume,
        issue,
        pages,
        doi,
        url,
        pdfUrl,
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
      message: '出版物创建成功',
      publication
    })

  } catch (error) {
    console.error('Error creating publication:', error)
    return NextResponse.json(
      { message: '创建出版物失败' },
      { status: 500 }
    )
  }
}