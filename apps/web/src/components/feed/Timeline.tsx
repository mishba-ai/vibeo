import React from 'react'
import Posts from './Posts'
import CreatePostcard from './CreatePostcard'
export default function Timeline() {
  return (
    <div className='mt-8 flex flex-col gap-y-8'>
      <CreatePostcard />
      <Posts />
    </div>
  )
}
