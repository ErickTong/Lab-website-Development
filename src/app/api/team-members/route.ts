import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const where = active === 'true' ? { active: true } : {}

    const teamMembers = await db.teamMember.findMany({
      where,
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json({
      teamMembers
    })

  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { message: '获取团队成员失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, title, bio, email, phone, research, education, order, active } = body

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
    if (!name || !title) {
      return NextResponse.json(
        { message: '姓名和职位为必填项' },
        { status: 400 }
      )
    }

    // Create team member
    const teamMember = await db.teamMember.create({
      data: {
        name,
        title,
        bio,
        email,
        phone,
        research,
        education,
        order: order || 0,
        active: active !== undefined ? active : true
      }
    })

    return NextResponse.json({
      message: '团队成员创建成功',
      teamMember
    })

  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { message: '创建团队成员失败' },
      { status: 500 }
    )
  }
}