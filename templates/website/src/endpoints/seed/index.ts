import { type CollectionSlug, type GlobalSlug, type Payload, type File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
]
const globals: GlobalSlug[] = ['header', 'footer']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({ payload }: { payload: Payload }): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not

  payload.logger.info(`— Clearing media...`)
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all([
    ...globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: { navItems: [] },
        context: {
          disableRevalidate: true,
        },
        depth: 0,
      }),
    ),
    ...collections.map((collection) =>
      payload.delete({
        collection,
        where: { id: { exists: true } },
        context: {
          disableRevalidate: true,
        },
        depth: 0,
      }),
    ),
    payload.delete({
      collection: 'pages',
      where: {},
      context: {
        disableRevalidate: true,
      },
      depth: 0,
    }),
    payload.delete({
      collection: 'users',
      depth: 0,
      where: {
        email: {
          equals: 'demo-author@payloadcms.com',
        },
      },
    }),
  ])

  payload.logger.info(`— Seeding demo author, media and categories...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const [
    demoAuthor,
    image1Doc,
    image2Doc,
    image3Doc,
    imageHomeDoc,
    technologyCategory,
    newsCategory,
    financeCategory,
  ] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@payloadcms.com',
        password: 'password',
      },
      depth: 0,
    }),
    payload.create({ collection: 'media', data: image1, file: image1Buffer }),
    payload.create({ collection: 'media', data: image2, file: image2Buffer }),
    payload.create({ collection: 'media', data: image2, file: image3Buffer }),
    payload.create({ collection: 'media', data: image2, file: hero1Buffer }),
    payload.create({
      collection: 'categories',
      depth: 0,
      data: {
        title: 'Technology',
      },
    }),
    payload.create({
      collection: 'categories',
      depth: 0,
      data: {
        title: 'News',
      },
    }),
    payload.create({
      collection: 'categories',
      depth: 0,
      data: {
        title: 'Finance',
      },
    }),
    payload.create({
      collection: 'categories',
      depth: 0,
      data: {
        title: 'Design',
      },
    }),
    payload.create({
      collection: 'categories',
      depth: 0,
      data: {
        title: 'Software',
      },
    }),
    payload.create({
      collection: 'categories',
      depth: 0,
      data: {
        title: 'Engineering',
      },
    }),
  ])

  let demoAuthorID: number | string = demoAuthor.id
  let image1ID: number | string = image1Doc.id
  let image2ID: number | string = image2Doc.id
  let image3ID: number | string = image3Doc.id
  let imageHomeID: number | string = imageHomeDoc.id

  if (payload.db.defaultIDType === 'text') {
    image1ID = `"${image1Doc.id}"`
    image2ID = `"${image2Doc.id}"`
    image3ID = `"${image3Doc.id}"`
    imageHomeID = `"${imageHomeDoc.id}"`
    demoAuthorID = `"${demoAuthorID}"`
  }

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    select: { content: false },
    data: JSON.parse(
      JSON.stringify({ ...post1, categories: [technologyCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image1ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
  })

  await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    select: { content: false },
    data: JSON.parse(
      JSON.stringify({ ...post2, categories: [newsCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image2ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image3ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
  })

  await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    select: { content: false },
    data: JSON.parse(
      JSON.stringify({ ...post3, categories: [financeCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image3ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image1ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: JSON.parse(JSON.stringify(contactFormData)),
    select: { title: true },
  })

  let contactFormID: number | string = contactForm.id

  if (payload.db.defaultIDType === 'text') {
    contactFormID = `"${contactFormID}"`
  }

  payload.logger.info(`— Seeding pages...`)

  const [_, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: JSON.parse(
        JSON.stringify(home)
          .replace(/"\{\{IMAGE_1\}\}"/g, String(imageHomeID))
          .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID)),
      ),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: JSON.parse(
        JSON.stringify(contactPageData).replace(
          /"\{\{CONTACT_FORM_ID\}\}"/g,
          String(contactFormID),
        ),
      ),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      depth: 0,
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      depth: 0,
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Admin',
              url: '/admin',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Source Code',
              newTab: true,
              url: 'https://github.com/payloadcms/payload/tree/beta/templates/website',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Payload',
              newTab: true,
              url: 'https://payloadcms.com/',
            },
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
