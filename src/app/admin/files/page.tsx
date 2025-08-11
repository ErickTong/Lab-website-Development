"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Upload, 
  LogOut,
  Settings,
  Download,
  Trash2,
  Eye,
  FileImage,
  File,
  Calendar,
  HardDrive
} from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  username: string
  email: string
  name?: string
  role: string
}

interface FileItem {
  id: string
  filename: string
  originalName: string
  path: string
  size: number
  mimetype: string
  createdAt: string
  uploadedBy: {
    name: string
    username: string
  }
}

export default function FilesManagement() {
  const [user, setUser] = useState<User | null>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchFiles()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("user")
    
    if (!token || !userData) {
      router.push("/auth/login")
      return
    }
    
    setUser(JSON.parse(userData))
  }

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("authToken")
      
      const response = await fetch("/api/files", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const filesData = await response.json()
        setFiles(filesData)
      }
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")
    setSuccess("")

    const formData = new FormData()
    formData.append('file', file)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("文件上传成功！")
        fetchFiles() // Refresh file list
      } else {
        setError(data.message || "文件上传失败")
      }
    } catch (err) {
      setError("网络错误，请稍后重试")
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("确定要删除这个文件吗？")) {
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        setFiles(files.filter(file => file.id !== fileId))
      } else {
        alert("删除失败")
      }
    } catch (error) {
      console.error("Error deleting file:", error)
      alert("删除失败")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN")
  }

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) {
      return <FileImage className="h-8 w-8 text-blue-500" />
    } else if (mimetype.includes('pdf')) {
      return <File className="h-8 w-8 text-red-500" />
    } else if (mimetype.includes('word') || mimetype.includes('document')) {
      return <File className="h-8 w-8 text-blue-600" />
    } else if (mimetype.includes('sheet') || mimetype.includes('excel')) {
      return <File className="h-8 w-8 text-green-600" />
    } else {
      return <File className="h-8 w-8 text-gray-500" />
    }
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  文件管理
                </h1>
                <p className="text-sm text-gray-600">西北旱区果树发育生物学实验室</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <p className="font-medium">{user.name || user.username}</p>
                    <p className="text-gray-500">{user.role}</p>
                  </div>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                退出
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">管理菜单</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin">
                  <Button variant="ghost" className="w-full justify-start">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    仪表板
                  </Button>
                </Link>
                <Link href="/admin/posts">
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    内容管理
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    用户管理
                  </Button>
                </Link>
                <Link href="/admin/files">
                  <Button variant="secondary" className="w-full justify-start">
                    <Upload className="mr-2 h-4 w-4" />
                    文件管理
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    系统设置
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">存储统计</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">文件数量</span>
                  <Badge variant="outline">{files.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">总大小</span>
                  <Badge variant="outline">{formatFileSize(totalSize)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">图片文件</span>
                  <Badge variant="outline">
                    {files.filter(f => f.mimetype.startsWith('image/')).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">文档文件</span>
                  <Badge variant="outline">
                    {files.filter(f => f.mimetype.includes('pdf') || f.mimetype.includes('document') || f.mimetype.includes('word')).length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Upload Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>文件上传</CardTitle>
                <CardDescription>支持图片、文档等多种格式</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800 mb-4">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    拖拽文件到此处或点击选择文件
                  </p>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                      multiple
                    />
                    <Button disabled={uploading}>
                      {uploading ? "上传中..." : "选择文件"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    支持的格式：JPG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Files List */}
            <Card>
              <CardHeader>
                <CardTitle>文件列表</CardTitle>
                <CardDescription>共 {files.length} 个文件</CardDescription>
              </CardHeader>
              <CardContent>
                {files.length > 0 ? (
                  <div className="space-y-4">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          {getFileIcon(file.mimetype)}
                          <div>
                            <h3 className="font-medium">{file.originalName}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <HardDrive className="h-3 w-3" />
                                {formatFileSize(file.size)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(file.createdAt)}
                              </span>
                              <span>上传者: {file.uploadedBy.name}</span>
                              <Badge variant="outline">{file.mimetype.split('/')[1]?.toUpperCase() || file.mimetype}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={file.path} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={file.path} download={file.originalName}>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Upload className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>暂无文件</p>
                    <p className="text-sm">上传第一个文件开始管理</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}