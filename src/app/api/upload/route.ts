import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { writeFile } from 'fs/promises'
import { join } from 'path'
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

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { message: '未授权访问' },
        { status: 401 }
      )
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json(
        { message: '没有找到文件' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${fileExtension}`

    // Save file to public/uploads directory
    const path = join(process.cwd(), 'public', 'uploads', filename)
    await writeFile(path, buffer)

    // Save file info to database
    const fileRecord = await db.file.create({
      data: {
        filename,
        originalName: file.name,
        path: `/uploads/${filename}`,
        size: file.size,
        mimetype: file.type,
        uploadedById: (decoded as any).userId
      }
    })

    const fileUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/uploads/${filename}`

    return NextResponse.json({
      message: '文件上传成功',
      url: fileUrl,
      file: fileRecord
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { message: '服务器错误' },
      { status: 500 }
    )
  }
}