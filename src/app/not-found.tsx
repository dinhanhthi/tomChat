// https://nextjs.org/docs/app/api-reference/file-conventions/not-found

import Link from 'next/link'
import BrandLogoWithText from '../components/brand'

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <BrandLogoWithText
        size={25}
        className="select-none gap-2 opacity-50 grayscale"
        textClassName="text-lg font-bold opacity-80"
        wrap={true}
      />
      <h1 className="text-3xl text-slate-700">404 Not found</h1>
      <Link className="text-primary" href="/">
        Back to home
      </Link>
    </div>
  )
}
