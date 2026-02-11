'use client'

import Image from "next/image";
import posthog from 'posthog-js'

const ExploreButton = () => {
  function handlePurchase() {
    console.log('Sending event to PostHog...')
    posthog.capture('explore_button_click')
    console.log('Event sent!')
  }

  return (
    <button type='button' id="explore-button" className="mt-7 mx-auto" onClick={handlePurchase}>
      <a href="#events">
        Explore Events
        <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24}/>
      </a>
    </button>
  )
}
export default ExploreButton
