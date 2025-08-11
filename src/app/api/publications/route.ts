import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    // Fetch all publications
    const publications = await db.publication.findMany({
      include: {
        author: {
          select: {
            name: true,
            username: true
          }
        }
      },
      orderBy: {
        year: 'desc'
      }
    })

    return NextResponse.json(publications)

  } catch (error) {
    console.error('Error fetching publications:', error)
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

    const { title, abstract, authors, journal, year, volume, issue, pages, doi, url, pdfUrl } = await request.json()

    if (!title || !authors || !journal || !year) {
      return NextResponse.json(
        { message: '标题、作者、期刊和年份不能为空' },
        { status: 400 }
      )
    }

    // Create publication
    const publication = await db.publication.create({
      data: {
        title,
        abstract: abstract || null,
        authors,
        journal,
        year,
        volume: volume || null,
        issue: issue || null,
        pages: pages || null,
        doi: doi || null,
        url: url || null,
        pdfUrl: pdfUrl || null,
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
      message: '论著创建成功',
      publication
    })

  } catch (error) {
    console.error('Error creating publication:', error)
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