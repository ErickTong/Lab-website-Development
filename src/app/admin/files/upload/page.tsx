'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, FileText, Image, Video, Music, File, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface UploadedFile {
  id: string
  filename: string
  originalName: string
  size: number
  mimetype: string
  path: string
  createdAt: string
}

export default function FileUploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" alt="Image file" />
    } else if (mimetype.startsWith('video/')) {
      return <Video className="h-8 w-8 text-green-500" />
    } else if (mimetype.startsWith('audio/')) {
      return <Music className="h-8 w-8 text-purple-500" />
    } else if (mimetype.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />
    } else {
      return <File className="h-8 w-8 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('请选择要上传的文件')
      return
    }

    setUploading(true)
    setError('')
    setUploadProgress(0)

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('请先登录')
        return
      }

      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/files', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          setUploadedFiles(prev => [...prev, data.file])
          setUploadProgress(((index + 1) / files.length) * 100)
          return data.file
        } else {
          throw new Error(`上传文件 ${file.name} 失败`)
        }
      })

      await Promise.all(uploadPromises)
      
      // Clear selected files after successful upload
      setFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回管理
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800">文件上传</h1>
              <p className="text-sm text-gray-600">上传和管理文件</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle>选择文件</CardTitle>
                <CardDescription>选择要上传的文件，支持多文件上传</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        点击选择文件
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        支持各种文件格式，单个文件最大 50MB
                      </span>
                    </label>
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>

                {/* Selected Files */}
                {files.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium">已选择的文件 ({files.length})</h3>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)} • {file.type}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Upload Progress */}
                    {uploading && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">上传进度</span>
                          <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
                        </div>
                        <Progress value={uploadProgress} className="w-full" />
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="mt-6">
                      <Button
                        onClick={handleUpload}
                        disabled={uploading || files.length === 0}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? '上传中...' : `上传 ${files.length} 个文件`}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>上传成功</CardTitle>
                  <CardDescription>以下文件已成功上传</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          {getFileIcon(file.mimetype)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.originalName}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)} • {file.mimetype}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(file.createdAt).toLocaleString('zh-CN')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* File Type Info */}
            <Card>
              <CardHeader>
                <CardTitle>支持的文件类型</CardTitle>
                <CardDescription>了解系统支持的文件类型和大小限制</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Image className="h-8 w-8 text-blue-500 mx-auto mb-2" alt="Image icon" />
                    <h4 className="font-medium">图片</h4>
                    <p className="text-xs text-gray-500">JPG, PNG, GIF, WebP</p>
                  </div>
                  <div className="text-center">
                    <Video className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium">视频</h4>
                    <p className="text-xs text-gray-500">MP4, AVI, MOV, WebM</p>
                  </div>
                  <div className="text-center">
                    <Music className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-medium">音频</h4>
                    <p className="text-xs text-gray-500">MP3, WAV, OGG, AAC</p>
                  </div>
                  <div className="text-center">
                    <FileText className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <h4 className="font-medium">文档</h4>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>文件大小限制：</strong>单个文件最大 50MB，总上传大小无限制
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}