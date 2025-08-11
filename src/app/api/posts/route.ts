import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { message: '未授权访问' },
        { status: 401 }
      )
    }

    // Fetch posts with author information
    const posts = await db.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            username: true
          }
        },
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(posts)

  } catch (error) {
    console.error('Error fetching posts:', error)
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

    const { title, content, excerpt, published, categoryId, coverImage } = await request.json()

    if (!title) {
      return NextResponse.json(
        { message: '标题不能为空' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Create post
    const post = await db.post.create({
      data: {
        title,
        slug,
        content: content || '',
        excerpt: excerpt || '',
        published: published || false,
        publishedAt: published ? new Date() : null,
        authorId: (decoded as any).userId,
        categoryId: categoryId || null,
        coverImage: coverImage || null
      },
      include: {
        author: {
          select: {
            name: true,
            username: true
          }
        },
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json({
      message: '文章创建成功',
      post
    })

  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { message: '服务器错误' },
      { status: 500 }
    )
  }
}