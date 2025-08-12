'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, User, Upload, Image as ImageIcon, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CreateTeamMemberPage() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    research: '',
    education: '',
    order: 0,
    active: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('请先登录')
        return
      }

      const response = await fetch('/api/team-members', {
        method: 'POST',
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
          window.location.href = '/admin'
        }, 2000)
      } else {
        setError(data.message || '创建团队成员失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      order: parseInt(e.target.value) || 0
    })
  }

  const handleActiveChange = (checked: boolean) => {
    setFormData({
      ...formData,
      active: checked
    })
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
            <CardTitle className="text-2xl text-green-600">团队成员创建成功！</CardTitle>
            <CardDescription>
              团队成员已成功创建，即将跳转到管理页面...
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
              <h1 className="text-xl font-bold text-gray-800">添加团队成员</h1>
              <p className="text-sm text-gray-600">添加新的实验室成员</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              type="submit" 
              form="member-form"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <form id="member-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>填写团队成员的基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名 *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="请输入姓名"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">职位 *</Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      required
                      placeholder="请输入职位"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="请输入邮箱地址"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">电话</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="请输入电话号码"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order">排序</Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      placeholder="排序数字"
                      value={formData.order}
                      onChange={handleOrderChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="active">状态</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={formData.active}
                        onCheckedChange={handleActiveChange}
                      />
                      <Label htmlFor="active">
                        {formData.active ? '在职' : '离职'}
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Image */}
            <Card>
              <CardHeader>
                <CardTitle>头像图片</CardTitle>
                <CardDescription>上传成员头像图片（可选）</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        点击上传头像
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </span>
                    </Label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Biography */}
            <Card>
              <CardHeader>
                <CardTitle>个人简介</CardTitle>
                <CardDescription>填写成员的个人简介</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="bio">简介</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="请输入个人简介..."
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Research */}
            <Card>
              <CardHeader>
                <CardTitle>研究方向</CardTitle>
                <CardDescription>填写成员的研究方向</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="research">研究方向</Label>
                  <Textarea
                    id="research"
                    name="research"
                    placeholder="请输入研究方向..."
                    value={formData.research}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle>教育背景</CardTitle>
                <CardDescription>填写成员的教育背景</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="education">教育背景</Label>
                  <Textarea
                    id="education"
                    name="education"
                    placeholder="请输入教育背景..."
                    value={formData.education}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </main>
      </div>
    </div>
  )
}