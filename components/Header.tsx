import { Briefcase, Home, HomeIcon, MessageCircle, Network, SearchCodeIcon, SearchIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Input } from './ui/input'
import Link from 'next/link'
import { SignedIn, SignedOut, SignIn, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'

const MENUS = [
    {
        name: 'Home',
        icon: <HomeIcon></HomeIcon>
    },
    {
        name: "Network",
        icon: <Network></Network>


    },
    {
        name: "Jobs",
        icon: <Briefcase></Briefcase>


    },
    {
        name: "Messageing",
        icon: <MessageCircle></MessageCircle>


    }
]

const Header = () => {
    return (
        <div className='flex max-w-6xl p-2
         text-center mx-auto'>
            <Image
                src={'/logo.png'}
                height={40}
                width={40}
                alt='logo'
            >

            </Image>
            <div className='flex-1'>
                <form className='flex max-w-96 items-center bg-gray-100 p-2 rounded-md mx-2'>
                    <SearchIcon className='h-4 text-gray-400'></SearchIcon>
                    <input type='text' placeholder='search for post'
                        className='bg-transparent flex-1 border-none outline-none'
                    >

                    </input>


                </form>

            </div>
            <div className='flex items-center space-x-2 px-6'>
                {
                    MENUS.map((item) => (
                        <Link key={item.name}
                            className='icon hidden md:flex gap-1 hover:bg-slate-100 px-2.5 py-1.5 duration-300 rounded-lg
                            '
                            href={'/'}

                        >
                            <span className='h-5'>
                                {item.icon}
                            </span>
                            <p>{item.name}</p>

                        </Link>
                    ))
                }

                {/* signed in user button if sined in */}
                <SignedIn>
                    <UserButton></UserButton>
                </SignedIn>

                {/* if not singed in then add singin and singup button */}
                <SignedOut>
                    <Button asChild variant={'secondary'} className='cursor-pointer'>
                        <SignInButton mode='modal'></SignInButton>
                    </Button>
                    <Button asChild className='cursor-pointer'>
                        <SignUpButton mode='modal'></SignUpButton>
                    </Button>

                </SignedOut>
            </div>



        </div >
    )
}

export default Header
