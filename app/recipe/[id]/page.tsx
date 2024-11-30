'use cache'

import { get, getAll } from '@vercel/edge-config'
import { notFound } from 'next/navigation'
import { Recipe, RecipeEdgeConfigItems } from '~/app/_lib/types'
import { list } from '@vercel/blob'
import { ImageGallery } from '~/app/_components/image-gallery'
import { RecipeCard } from '~/app/_components/recipe'

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const recipe = await get<Recipe>(Number(id).toString())

  if (!recipe) return notFound()

  const photos = await list({
    prefix: `${id} - ${recipe.name}`,
  })

  return (
    <div className='relative flex flex-col gap-4 -mb-4'>
      <RecipeCard recipe={recipe} id={id} />
      {/* TODO: Improve communicating that this element is scrollable */}
      <div className='relative left-[50%] -translate-x-1/2 w-screen overflow-x-scroll snap-x snap-mandatory overscroll-x-contain mt-10 smooth-scroll touch-pan-x'>
        <ImageGallery photos={photos.blobs} recipeName={recipe.name} />
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const recipes = await getAll<RecipeEdgeConfigItems>()
  return Object.keys(recipes).map((id) => ({
    id,
  }))
}
