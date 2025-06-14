
import Postfeed from '@/components/Postfeed'
import PostForm from '@/components/PostForm'
import UserInformation from '@/components/UserInformation'
import connectDb from '@/db/connecDb'
import { Post } from '@/db/models/post'
import { SignedIn } from '@clerk/nextjs'
import React from 'react';

export const revalidate = 0

const Home = async () => {
  await connectDb();
  const posts = await Post.getAllPosts();


  return (
    <div className='grid grid-cols-8 sm:mx-5 mt-5'>
      {/* left side user info */}
      <section className='hidden md:col-span-2 md:inline' >
        <UserInformation  ></UserInformation>

      </section >
      {/* middle posts and feeds */}
      <section className='col-span-full sticky md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full'>
        {/* post input field */}
        <SignedIn>

          <PostForm></PostForm>

        </SignedIn>

        {
          posts.length == 0 && (<h1>Posts not found</h1>)
        }
        <div className='overflow-hidden'>
          <Postfeed posts={posts}></Postfeed>
        </div>

      </section>

      {/* news section */}
      <section className='hidden xl:inline justify-center col-span-2'>
      </section>

    </div>
  )
}

export default Home
