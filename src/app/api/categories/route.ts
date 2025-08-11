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

    // Fetch all categories
    const categories = await db.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(categories)

  } catch (error) {
    console.error('Error fetching categories:', error)
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

    const { name, description, color } = await request.json()

    if (!name) {
      return NextResponse.json(
        { message: '分类名称不能为空' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if category already exists
    const existingCategory = await db.category.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { message: '分类已存在' },
        { status: 409 }
      )
    }

    // Create category
    const category = await db.category.create({
      data: {
        name,
        slug,
        description: description || null,
        color: color || null
      }
    })

    return NextResponse.json({
      message: '分类创建成功',
      category
    })

  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { message: '服务器错误' },
      { status: 500 }
    )
  }
}