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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { message: '未授权访问' },
        { status: 401 }
      )
    }

    const post = await db.post.findUnique({
      where: { id: params.id },
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
        },
        files: true
      }
    })

    if (!post) {
      return NextResponse.json(
        { message: '文章不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)

  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { message: '服务器错误' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if post exists
    const existingPost = await db.post.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { message: '文章不存在' },
        { status: 404 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Update post
    const post = await db.post.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        content: content || '',
        excerpt: excerpt || '',
        published: published || false,
        publishedAt: published ? new Date() : null,
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
      message: '文章更新成功',
      post
    })

  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { message: '服务器错误' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { message: '未授权访问' },
        { status: 401 }
      )
    }

    // Check if post exists
    const existingPost = await db.post.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { message: '文章不存在' },
        { status: 404 }
      )
    }

    // Delete post
    await db.post.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: '文章删除成功'
    })

  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { message: '服务器错误' },
      { status: 500 }
    )
  }
}