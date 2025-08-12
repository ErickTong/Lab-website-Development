'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Eye,
  Upload,
  BookOpen,
  FlaskConical,
  UserPlus
} from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  email: string
  username: string
  name?: string
  avatar?: string
  role: string
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  published: boolean
  publishedAt?: string
  createdAt: string
  author: {
    name: string
  }
}

interface FileItem {
  id: string
  filename: string
  originalName: string
  size: number
  mimetype: string
  createdAt: string
}

interface TeamMember {
  id: string
  name: string
  title: string
  bio?: string
  email?: string
  phone?: string
  research?: string
  education?: string
  order: number
  active: boolean
  avatar?: string
  createdAt: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [files, setFiles] = useState<FileItem[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'files' | 'team' | 'settings'>('dashboard')

  useEffect(() => {
    checkAuth()
    fetchDashboardData()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      window.location.href = '/auth/login'
      return
    }

    try {
      setUser(JSON.parse(userData))
    } catch (error) {
      console.error('Error parsing user data:', error)
      window.location.href = '/auth/login'
    }
  }

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const [postsRes, filesRes, teamRes] = await Promise.all([
        fetch('/api/posts', { headers }),
        fetch('/api/files', { headers }),
        fetch('/api/team-members', { headers })
      ])

      if (postsRes.ok) {
        const postsData = await postsRes.json()
        setPosts(postsData.posts || [])
      }

      if (filesRes.ok) {
        const filesData = await filesRes.json()
        setFiles(filesData.files || [])
      }

      if (teamRes.ok) {
        const teamData = await teamRes.json()
        setTeamMembers(teamData.teamMembers || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      if (!token) return

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId))
      } else {
        const data = await response.json()
        alert(data.message || '删除文章失败')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('删除文章失败')
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('确定要删除这个文件吗？此操作不可撤销。')) {
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      if (!token) return

      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setFiles(files.filter(file => file.id !== fileId))
      } else {
        const data = await response.json()
        alert(data.message || '删除文件失败')
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('删除文件失败')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                西北旱区果树发育生物学实验室
              </h1>
              <p className="text-sm text-gray-600">管理系统</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.charAt(0) || user?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name || user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  仪表盘
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'posts'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  内容管理
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('files')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'files'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Upload className="h-5 w-5" />
                  文件管理
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('team')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'team'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  团队管理
                </button>
              </li>
              <li>
                <Link href="/research" className="flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors">
                  <BookOpen className="h-5 w-5" />
                  研究成果
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  系统设置
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">仪表盘</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">总文章数</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{posts.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {posts.filter(p => p.published).length} 已发布
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">文件数量</CardTitle>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{files.length}</div>
                    <p className="text-xs text-muted-foreground">
                      总大小 {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">用户角色</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user?.role}</div>
                    <p className="text-xs text-muted-foreground">
                      当前权限级别
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">系统状态</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">正常</div>
                    <p className="text-xs text-muted-foreground">
                      所有系统运行正常
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Posts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>最新文章</CardTitle>
                    <CardDescription>最近创建或修改的文章</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {posts.slice(0, 5).map((post) => (
                        <div key={post.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{post.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(post.createdAt)}</span>
                              <Badge variant={post.published ? "default" : "secondary"}>
                                {post.published ? "已发布" : "草稿"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/posts/edit/${post.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/posts/${post.slug}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                      {posts.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">暂无文章</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>最新文件</CardTitle>
                    <CardDescription>最近上传的文件</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {files.slice(0, 5).map((file) => (
                        <div key={file.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{file.originalName}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <span>{file.mimetype}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={file.path} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {files.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">暂无文件</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">内容管理</h2>
                <Link href="/admin/posts/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    新建文章
                  </Button>
                </Link>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>所有文章</CardTitle>
                  <CardDescription>管理您的所有文章内容</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{post.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>作者: {post.author.name}</span>
                            <span>创建时间: {formatDate(post.createdAt)}</span>
                            {post.publishedAt && (
                              <span>发布时间: {formatDate(post.publishedAt)}</span>
                            )}
                          </div>
                          {post.excerpt && (
                            <p className="text-sm text-gray-600 mt-2">{post.excerpt}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "已发布" : "草稿"}
                          </Badge>
                          <Link href={`/admin/posts/edit/${post.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="mr-2 h-4 w-4" />
                              编辑
                            </Button>
                          </Link>
                          <Link href={`/posts/${post.slug}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              查看
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除
                          </Button>
                        </div>
                      </div>
                    ))}
                    {posts.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">暂无文章</p>
                        <Button className="mt-4">
                          <Plus className="mr-2 h-4 w-4" />
                          创建第一篇文章
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'files' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">文件管理</h2>
                <Link href="/admin/files/upload">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    上传文件
                  </Button>
                </Link>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>所有文件</CardTitle>
                  <CardDescription>管理您的所有上传文件</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{file.originalName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>大小: {formatFileSize(file.size)}</span>
                            <span>类型: {file.mimetype}</span>
                            <span>上传时间: {formatDate(file.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={file.path} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              查看
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteFile(file.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除
                          </Button>
                        </div>
                      </div>
                    ))}
                    {files.length === 0 && (
                      <div className="text-center py-12">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">暂无文件</p>
                        <Link href="/admin/files/upload">
                          <Button className="mt-4">
                            <Plus className="mr-2 h-4 w-4" />
                            上传第一个文件
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">团队管理</h2>
                <Link href="/admin/team/create">
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    添加成员
                  </Button>
                </Link>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>团队成员</CardTitle>
                  <CardDescription>管理实验室团队成员信息</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.title}</p>
                            {member.email && (
                              <p className="text-xs text-gray-500">{member.email}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={member.active ? "default" : "secondary"}>
                            {member.active ? "在职" : "离职"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            编辑
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            查看
                          </Button>
                        </div>
                      </div>
                    ))}
                    {teamMembers.length === 0 && (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">暂无团队成员</p>
                        <Link href="/admin/team/create">
                          <Button className="mt-4">
                            <UserPlus className="mr-2 h-4 w-4" />
                            添加第一个成员
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">系统设置</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>个人信息</CardTitle>
                    <CardDescription>管理您的个人资料和账户设置</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="text-lg">{user?.name?.charAt(0) || user?.username?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{user?.name || user?.username}</h3>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                          <Badge variant="outline">{user?.role}</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          编辑个人资料
                        </Button>
                        <Button variant="outline" className="w-full">
                          修改密码
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>系统信息</CardTitle>
                    <CardDescription>查看系统状态和配置信息</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">系统版本</span>
                        <span className="text-sm font-medium">v1.0.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">数据库状态</span>
                        <Badge variant="default">正常</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">存储空间</span>
                        <span className="text-sm font-medium">可用</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">最后更新</span>
                        <span className="text-sm font-medium">{new Date().toLocaleDateString('zh-CN')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}