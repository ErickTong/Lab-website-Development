import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { unlink } from 'fs/promises'

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

    // Check if file exists
    const existingFile = await db.file.findUnique({
      where: { id: params.id }
    })

    if (!existingFile) {
      return NextResponse.json(
        { message: '文件不存在' },
        { status: 404 }
      )
    }

    // Delete file from filesystem
    try {
      const filePath = join(process.cwd(), 'public', existingFile.path)
      await unlink(filePath)
    } catch (fileError) {
      console.warn('File not found in filesystem, continuing with database deletion:', fileError)
    }

    // Delete file from database
    await db.file.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: '文件删除成功'
    })

  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { message: '服务器错误' },
      { status: 500 }
    )
  }
}