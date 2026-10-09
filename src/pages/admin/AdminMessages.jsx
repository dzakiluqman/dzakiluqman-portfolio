import React, { useState, useEffect } from 'react'
import { 
  Mail, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Search, 
  Reply, 
  MailCheck, 
  MailWarning, 
  AlertCircle,
  Inbox
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { mockMessages } from '../../lib/mockData'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export const AdminMessages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const loadMessages = async () => {
    setLoading(true)
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('dzaki_demo_messages')
      const initial = stored ? JSON.parse(stored) : mockMessages
      setMessages(initial)
      if (initial.length > 0 && !selectedMessage) {
        setSelectedMessage(initial[0])
      }
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data || [])
      if (data && data.length > 0 && !selectedMessage) {
        setSelectedMessage(data[0])
      }
    } catch (err) {
      showNotification('Error loading messages: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const handleToggleRead = async (msg) => {
    const updatedStatus = !msg.is_read

    if (!isSupabaseConfigured) {
      const updated = messages.map((m) => (m.id === msg.id ? { ...m, is_read: updatedStatus } : m))
      setMessages(updated)
      localStorage.setItem('dzaki_demo_messages', JSON.stringify(updated))
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, is_read: updatedStatus })
      }
      showNotification(updatedStatus ? 'Marked as read' : 'Marked as unread')
      return
    }

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: updatedStatus })
        .eq('id', msg.id)

      if (error) throw error
      const updated = messages.map((m) => (m.id === msg.id ? { ...m, is_read: updatedStatus } : m))
      setMessages(updated)
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, is_read: updatedStatus })
      }
      showNotification(updatedStatus ? 'Message marked as read' : 'Marked as unread')
    } catch (err) {
      showNotification(err.message, 'error')
    }
  }

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return

    if (!isSupabaseConfigured) {
      const updated = messages.filter((m) => m.id !== id)
      setMessages(updated)
      localStorage.setItem('dzaki_demo_messages', JSON.stringify(updated))
      if (selectedMessage?.id === id) {
        setSelectedMessage(updated[0] || null)
      }
      showNotification('Message deleted')
      return
    }

    try {
      const { error } = await supabase.from('messages').delete().eq('id', id)
      if (error) throw error
      const updated = messages.filter((m) => m.id !== id)
      setMessages(updated)
      if (selectedMessage?.id === id) {
        setSelectedMessage(updated[0] || null)
      }
      showNotification('Message deleted permanently')
    } catch (err) {
      showNotification(err.message, 'error')
    }
  }

  const filteredMessages = messages.filter((m) => {
    const matchesFilter =
      filter === 'all' || (filter === 'unread' && !m.is_read) || (filter === 'read' && m.is_read)
    const matchesSearch =
      m.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sender_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row text-slate-100">
      <Sidebar unreadCount={unreadCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Inbound Messages"
          subtitle={`Review inquiries submitted by portfolio visitors (${unreadCount} unread)`}
        />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {notification && (
            <div
              className="p-4 rounded-xl flex items-center gap-2 text-xs font-medium bg-zinc-900 border border-zinc-700 text-zinc-200"
            >
              {notification.type === 'error' ? <AlertCircle className="w-4 h-4 text-zinc-400" /> : <CheckCircle className="w-4 h-4 text-white" />}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search messages by name, email, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#000000] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-[#000000] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === 'unread'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-[#000000] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === 'read'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-[#000000] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                Read ({messages.length - unreadCount})
              </button>
            </div>
          </div>

          {/* Master-Detail Messages View */}
          {loading ? (
            <LoadingSpinner text="Loading message inbox..." />
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-16 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
              <Inbox className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-base font-semibold text-white">No messages found</h3>
              <p className="text-xs text-zinc-400">All caught up! Inbound inquiries will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Message List (Left) */}
              <div className="lg:col-span-5 space-y-3 max-h-[650px] overflow-y-auto pr-1">
                {filteredMessages.map((msg) => {
                  const isSelected = selectedMessage?.id === msg.id
                  return (
                    <div
                      key={msg.id}
                      onClick={() => {
                        setSelectedMessage(msg)
                        if (!msg.is_read) handleToggleRead(msg)
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white/[0.08] border-white/40 shadow-sm'
                          : msg.is_read
                          ? 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700'
                          : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${!msg.is_read ? 'text-white' : 'text-zinc-400'}`}>
                          {msg.sender_name}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-white truncate">{msg.subject || 'No Subject'}</p>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{msg.message}</p>
                    </div>
                  )
                })}
              </div>

              {/* Message Details (Right) */}
              <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
                {selectedMessage ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">
                          {selectedMessage.subject || 'No Subject'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                          <span className="text-zinc-300 font-semibold">{selectedMessage.sender_name}</span>
                          <span className="text-zinc-600">•</span>
                          <a
                            href={`mailto:${selectedMessage.sender_email}`}
                            className="text-zinc-300 hover:text-white hover:underline font-mono"
                          >
                            {selectedMessage.sender_email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRead(selectedMessage)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Toggle Read"
                        >
                          {selectedMessage.is_read ? <MailWarning className="w-3.5 h-3.5" /> : <MailCheck className="w-3.5 h-3.5" />}
                          <span>{selectedMessage.is_read ? 'Mark Unread' : 'Mark Read'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteMessage(selectedMessage.id)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                          title="Delete Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Received: {new Date(selectedMessage.created_at).toLocaleString()}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#000000] border border-zinc-800 text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans min-h-[160px]">
                      {selectedMessage.message}
                    </div>

                    <div className="pt-4 border-t border-zinc-800 flex justify-end">
                      <a
                        href={`mailto:${selectedMessage.sender_email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow-sm transition-all"
                      >
                        <Reply className="w-4 h-4" />
                        <span>Reply via Email</span>
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20 text-zinc-500 text-xs">
                    Select a message from the list to preview details.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminMessages
