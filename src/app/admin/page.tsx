"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Upload, 
  LogOut,
  Settings,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Eye
} from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  username: string
  email: string
  name?: string
  role: string
}

interface Post {
  id: string
  title: string
  published: boolean
  createdAt: string
  author: {
    name: string
  }
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchDashboardData()
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

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      
      // Fetch posts
      const postsResponse = await fetch("/api/posts", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setPosts(postsData.slice(0, 5)) // Show only 5 recent posts
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN")
  }

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
                  管理后台
                </h1>
                <p className="text-sm text-gray-600">西北旱区果树发育生物学实验室</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback>{user.name?.[0] || user.username[0]}</AvatarFallback>
                  </Avatar>
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
                  <Button variant="secondary" className="w-full justify-start">
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
                  <Button variant="ghost" className="w-full justify-start">
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
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">总文章数</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{posts.length}</div>
                  <p className="text-xs text-muted-foreground">已发布文章</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">用户数量</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">注册用户</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">文件数量</CardTitle>
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">上传文件</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>最近文章</CardTitle>
                    <CardDescription>最新发布的内容</CardDescription>
                  </div>
                  <Link href="/admin/posts">
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      新建文章
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{post.title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(post.createdAt)}
                            </span>
                            <span>作者: {post.author.name}</span>
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? "已发布" : "草稿"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>暂无文章</p>
                    <Link href="/admin/posts">
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        创建第一篇文章
                      </Button>
                    </Link>
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