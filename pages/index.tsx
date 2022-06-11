import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import LocationPage from './form/location'

const Home: NextPage = () => {
  return (
    <LocationPage />
  )
}

export default Home
