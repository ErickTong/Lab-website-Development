'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Eye, Upload, Image as ImageIcon, Loader2 } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
}

interface Post {
  id: string
  title: string
  content: string
  excerpt?: string
  published: boolean
  categoryId?: string
  coverImage?: string
  slug: string
}

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false,
    categoryId: '',
    coverImage: ''
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchPost()
    fetchCategories()
  }, [postId])

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`/api/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const post = await response.json()
        setFormData({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || '',
          published: post.published,
          categoryId: post.categoryId || '',
          coverImage: post.coverImage || ''
        })
      } else {
        setError('获取文章失败')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return

      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('请先登录')
        return
      }

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Redirect to admin dashboard after 2 seconds
        setTimeout(() => {
          router.push('/admin')
        }, 2000)
      } else {
        setError(data.message || '更新文章失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      categoryId: value
    })
  }

  const handlePublishedChange = (checked: boolean) => {
    setFormData({
      ...formData,
      published: checked
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl text-green-600">文章更新成功！</CardTitle>
            <CardDescription>
              您的文章已成功更新，即将跳转到管理页面...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
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
              <h1 className="text-xl font-bold text-gray-800">编辑文章</h1>
              <p className="text-sm text-gray-600">修改文章内容</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href={`/posts/${formData.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()}`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                预览
              </Button>
            </Link>
            <Button 
              type="submit" 
              form="post-form"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saving ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <form id="post-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>填写文章的基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">标题 *</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    placeholder="请输入文章标题"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">摘要</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    placeholder="请输入文章摘要（可选）"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">分类</Label>
                    <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择文章分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="published">发布状态</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={handlePublishedChange}
                      />
                      <Label htmlFor="published">
                        {formData.published ? '已发布' : '草稿'}
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>封面图片</CardTitle>
                <CardDescription>上传文章封面图片（可选）</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="cover-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        点击上传图片
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </span>
                    </Label>
                    <Input
                      id="cover-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>文章内容</CardTitle>
                <CardDescription>编写文章的主要内容</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="content">内容 *</Label>
                  <Textarea
                    id="content"
                    name="content"
                    required
                    placeholder="请输入文章内容..."
                    value={formData.content}
                    onChange={handleChange}
                    rows={15}
                    className="min-h-[400px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>附件上传</CardTitle>
                <CardDescription>为文章添加附件文件（可选）</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        点击上传文件
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        支持各种文件格式，最大 50MB
                      </span>
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </main>
      </div>
    </div>
  )
}