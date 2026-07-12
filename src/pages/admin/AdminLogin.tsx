import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, Lock, Loader as Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import AnimatedBackground from '@/components/AnimatedBackground'

interface FormValues { email: string; password: string; remember: boolean }

export default function AdminLogin() {
  const { signIn, resetPassword } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forgot, setForgot] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({ defaultValues: { email: '', password: '', remember: true } })
  const onSubmit = async (data: FormValues) => { setError(null); setBusy(true); const { error } = await signIn(data.email, data.password); setBusy(false); if (error) { setError(error); return }; navigate('/admin') }
  const handleForgot = async () => { const email = watch('email'); if (!email) { setError('Enter your email above first.'); return }; setBusy(true); const { error } = await resetPassword(email); setBusy(false); if (error) { setError(error); return }; setForgotSent(true) }
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <AnimatedBackground />
      <Link to="/" className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-white hover:text-white transition-colors z-10"><ArrowLeft className="h-4 w-4" /> Back to site</Link>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass-strong w-full max-w-md p-8 md:p-10 rounded-3xl">
        <div className="flex items-center gap-2 mb-8"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient font-display font-bold text-white shadow-glow">Y</span><div><div className="font-display font-semibold text-white">YTJ Studio</div><div className="text-xs text-white">Admin Dashboard</div></div></div>
        <h1 className="heading-md text-white">{forgot ? 'Reset password' : 'Welcome back'}</h1>
        <p className="mt-2 text-sm text-white">{forgot ? "Enter your email and we'll send you a reset link." : 'Sign in to manage your portfolio.'}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <label className="block"><span className="block text-sm text-white mb-2">Email</span><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white" /><input {...register('email', { required: 'Email is required' })} type="email" placeholder="admin@ytjstudio.com" className="w-full glass pl-11 pr-4 py-3 rounded-xl outline-none focus:border-brand-purple/50 transition-colors text-white" /></div>{errors.email && <span className="block mt-1 text-xs text-red-400">{errors.email.message}</span>}</label>
          {!forgot && (<label className="block"><span className="block text-sm text-white mb-2">Password</span><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white" /><input {...register('password', { required: 'Password is required' })} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full glass pl-11 pr-11 py-3 rounded-xl outline-none focus:border-brand-purple/50 transition-colors text-white" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-white hover:text-white" aria-label="Toggle password">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>{errors.password && <span className="block mt-1 text-xs text-red-400">{errors.password.message}</span>}</label>)}
          {!forgot && <label className="flex items-center gap-2 text-sm text-white cursor-pointer"><input type="checkbox" {...register('remember')} className="accent-brand-purple" /> Remember me</label>}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {forgotSent && <p className="text-sm text-brand-glow">Reset link sent. Check your inbox.</p>}
          <button type="submit" disabled={busy || forgot} className="btn-primary w-full disabled:opacity-60">{busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Please wait...</> : forgot ? 'Send reset link' : 'Sign in'}</button>
        </form>
        <button onClick={() => { setForgot((v) => !v); setError(null); setForgotSent(false) }} className="mt-4 w-full text-sm text-white hover:text-white transition-colors">{forgot ? 'Back to sign in' : 'Forgot password?'}</button>
        {forgot && <button onClick={handleForgot} disabled={busy} className="mt-2 w-full text-sm text-brand-purple hover:text-brand-glow transition-colors disabled:opacity-60">Send reset link</button>}
      </motion.div>
    </div>
  )
}
