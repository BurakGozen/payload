import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { reorderColumns } from 'helpers/e2e/reorderColumns.js'
import * as path from 'path'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../helpers/sdk/index.js'
import type { Config } from './payload-types.js'

import {
  ensureCompilationIsDone,
  exactText,
  initPageConsoleErrorCatch,
  saveDocAndAssert,
} from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { navigateToDoc } from '../helpers/e2e/navigateToDoc.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../playwright.config.js'
import { categoriesSlug, postsSlug, uploadsSlug } from './shared.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

let payload: PayloadTestSDK<Config>
let serverURL: string

test.describe('Admin Panel', () => {
  let page: Page
  let categoriesURL: AdminUrlUtil
  let uploadsURL: AdminUrlUtil
  let postsURL: AdminUrlUtil

  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
    }))
    postsURL = new AdminUrlUtil(serverURL, postsSlug)
    categoriesURL = new AdminUrlUtil(serverURL, categoriesSlug)
    uploadsURL = new AdminUrlUtil(serverURL, uploadsSlug)

    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)
    await ensureCompilationIsDone({ page, serverURL })
  })

  test('should populate joined relationships in table cells of list view', async () => {
    await page.goto(categoriesURL.list)
    await expect
      .poll(
        async () =>
          await page
            .locator('tbody tr:first-child td.cell-relatedPosts', {
              hasText: exactText('Test Post 3, Test Post 2, Test Post 1'),
            })
            .isVisible(),
      )
      .toBeTruthy()
  })

  test('should render initial rows within relationship table', async () => {
    await navigateToDoc(page, categoriesURL)
    const joinField = page.locator('#field-relatedPosts.field-type.join')
    await expect(joinField).toBeVisible()
    await expect(joinField.locator('.relationship-table table')).toBeVisible()
    const rows = joinField.locator('.relationship-table tbody tr')
    await expect(rows).toHaveCount(3)
  })

  test('should apply defaultLimit and defaultSort on relationship table', async () => {
    const result = await payload.find({
      collection: categoriesSlug,
      limit: 1,
    })
    const category = result.docs[0]
    // seed additional posts to test defaultLimit (5)
    await payload.create({
      collection: postsSlug,
      data: {
        title: 'a',
        category: category.id,
      },
    })
    await payload.create({
      collection: postsSlug,
      data: {
        title: 'b',
        category: category.id,
      },
    })
    await payload.create({
      collection: postsSlug,
      data: {
        title: 'z',
        category: category.id,
      },
    })
    await navigateToDoc(page, categoriesURL)
    const joinField = page.locator('#field-relatedPosts.field-type.join')
    await expect(joinField.locator('.row-1 > .cell-title')).toContainText('z')
    await expect(joinField.locator('.paginator > .clickable-arrow--right')).toBeVisible()
    const rows = joinField.locator('.relationship-table tbody tr')
    await expect(rows).toHaveCount(5)
  })

  test('should render join field for hidden posts', async () => {
    await navigateToDoc(page, categoriesURL)
    const joinField = page.locator('#field-hiddenPosts.field-type.join')
    await expect(joinField).toBeVisible()
    await expect(joinField.locator('.relationship-table table')).toBeVisible()
    const columns = await joinField.locator('.relationship-table tbody tr').count()
    expect(columns).toBe(1)
    const button = joinField.locator('button.doc-drawer__toggler.relationship-table__add-new')
    await expect(button).toBeVisible()
    await button.click()
    const drawer = page.locator('[id^=doc-drawer_hidden-posts_1_]')
    await expect(drawer).toBeVisible()
    const titleField = drawer.locator('#field-title')
    await expect(titleField).toBeVisible()
    await titleField.fill('Test Hidden Post')
    await drawer.locator('button[id="action-save"]').click()
    await expect(joinField.locator('.relationship-table tbody tr')).toBeVisible()
    const newColumns = await joinField.locator('.relationship-table tbody tr').count()
    expect(newColumns).toBe(2)
  })

  test('should render the create page and create doc with the join field', async () => {
    await page.goto(categoriesURL.create)
    const nameField = page.locator('#field-name')
    await expect(nameField).toBeVisible()

    // assert that the join field is visible and is not stuck in a loading state
    await expect(page.locator('#field-relatedPosts')).toContainText('No Posts found.')
    await expect(page.locator('#field-relatedPosts')).not.toContainText('loading')

    // assert that the create new button is not visible
    await expect(page.locator('#field-relatedPosts > .relationship-table__add-new')).toBeHidden()

    // assert that the admin.description is visible
    await expect(page.locator('.field-description-hasManyPosts')).toHaveText('Static Description')

    //assert that the admin.components.Description is visible
    await expect(page.locator('.field-description-relatedPosts')).toHaveText(
      'Component description: relatedPosts',
    )

    await nameField.fill('test category')
    await saveDocAndAssert(page)
  })

  test('should render collection type in first column of relationship table', async () => {
    await navigateToDoc(page, categoriesURL)
    const joinField = page.locator('#field-relatedPosts.field-type.join')
    await expect(joinField).toBeVisible()
    const collectionTypeColumn = joinField.locator('thead tr th#heading-collection:first-child')
    const text = collectionTypeColumn
    await expect(text).toHaveText('Type')
    const cells = joinField.locator('.relationship-table tbody tr td:first-child .pill__label')

    const count = await cells.count()

    for (let i = 0; i < count; i++) {
      const element = cells.nth(i)
      // Perform actions on each element
      await expect(element).toBeVisible()
      await expect(element).toHaveText('Post')
    }
  })

  test('should render drawer toggler without document link in second column of relationship table', async () => {
    await navigateToDoc(page, categoriesURL)
    const joinField = page.locator('#field-relatedPosts.field-type.join')
    await expect(joinField).toBeVisible()
    const actionColumn = joinField.locator('tbody tr td:nth-child(2)').first()
    const toggler = actionColumn.locator('button.doc-drawer__toggler')
    await expect(toggler).toBeVisible()
    const link = actionColumn.locator('a')
    await expect(link).toBeHidden()

    await reorderColumns(page, {
      togglerSelector: '.relationship-table__toggle-columns',
      columnContainerSelector: '.relationship-table__columns',
      fromColumn: 'Category',
      toColumn: 'Title',
    })

    const newActionColumn = joinField.locator('tbody tr td:nth-child(2)').first()
    const newToggler = newActionColumn.locator('button.doc-drawer__toggler')
    await expect(newToggler).toBeVisible()
    const newLink = newActionColumn.locator('a')
    await expect(newLink).toBeHidden()

    // put columns back in original order for the next test
    await reorderColumns(page, {
      togglerSelector: '.relationship-table__toggle-columns',
      columnContainerSelector: '.relationship-table__columns',
      fromColumn: 'Title',
      toColumn: 'Category',
    })
  })

  test('should sort relationship table by clicking on column headers', async () => {
    await navigateToDoc(page, categoriesURL)
    const joinField = page.locator('#field-relatedPosts.field-type.join')
    await expect(joinField).toBeVisible()
    const titleColumn = joinField.locator('thead tr th#heading-title')
    const titleAscButton = titleColumn.locator('button.sort-column__asc')
    await expect(titleAscButton).toBeVisible()
    await titleAscButton.click()
    await expect(joinField.locator('tbody tr:first-child td:nth-child(2)')).toHaveText(
      'Test Post 1',
    )

    const titleDescButton = titleColumn.locator('button.sort-column__desc')
    await expect(titleDescButton).toBeVisible()
    await titleDescButton.click()
    await expect(joinField.locator('tbody tr:first-child td:nth-child(2)')).toHaveText(
      'Test Post 3',
    )
  })

  test('should update relationship table when new document is created', async () => {
    await navigateToDoc(page, categoriesURL)
    const joinField = page.locator('#field-relatedPosts.field-type.join')
    await expect(joinField).toBeVisible()

    const addButton = joinField.locator('.relationship-table__actions button.doc-drawer__toggler', {
      hasText: exactText('Add new'),
    })

    await expect(addButton).toBeVisible()

    await addButton.click()
    const drawer = page.locator('[id^=doc-drawer_posts_1_]')
    await expect(drawer).toBeVisible()
    const categoryField = drawer.locator('#field-category')
    await expect(categoryField).toBeVisible()
    const categoryValue = categoryField.locator('.relationship--single-value__text')
    await expect(categoryValue).toHaveText('example')
    const titleField = drawer.locator('#field-title')
    await expect(titleField).toBeVisible()
    await titleField.fill('Test Post 4')
    await drawer.locator('button[id="action-save"]').click()
    await expect(drawer).toBeHidden()
    await expect(
      joinField.locator('tbody tr td:nth-child(2)', {
        hasText: exactText('Test Post 4'),
      }),
    ).toBeVisible()
  })

  test('should update relationship table when document is updated', async () => {
    await navigateToDoc(page, categoriesURL)
    const joinField = page.locator('#field-relatedPosts.field-type.join')
    await expect(joinField).toBeVisible()
    const editButton = joinField.locator(
      'tbody tr:first-child td:nth-child(2) button.doc-drawer__toggler',
    )
    await expect(editButton).toBeVisible()
    await editButton.click()
    const drawer = page.locator('[id^=doc-drawer_posts_1_]')
    await expect(drawer).toBeVisible()
    const titleField = drawer.locator('#field-title')
    await expect(titleField).toBeVisible()
    await titleField.fill('Test Post 1 Updated')
    await drawer.locator('button[id="action-save"]').click()
    await expect(drawer).toBeHidden()
    await expect(joinField.locator('tbody tr:first-child td:nth-child(2)')).toHaveText(
      'Test Post 1 Updated',
    )
  })

  test('should render empty relationship table when creating new document', async () => {
    await page.goto(categoriesURL.create)
    const joinField = page.locator('#field-relatedPosts.field-type.join')
    await expect(joinField).toBeVisible()
    await expect(joinField.locator('.relationship-table tbody tr')).toBeHidden()
  })

  test('should update relationship table when new upload is created', async () => {
    await navigateToDoc(page, uploadsURL)
    const joinField = page.locator('#field-relatedPosts.field-type.join')
    await expect(joinField).toBeVisible()

    // TODO: change this to edit the first row in the join table
    const addButton = joinField.locator('.relationship-table__actions button.doc-drawer__toggler', {
      hasText: exactText('Add new'),
    })

    await expect(addButton).toBeVisible()

    await addButton.click()
    const drawer = page.locator('[id^=doc-drawer_posts_1_]')
    await expect(drawer).toBeVisible()
    const uploadField = drawer.locator('#field-upload')
    await expect(uploadField).toBeVisible()
    const uploadValue = uploadField.locator('.upload-relationship-details img')
    await expect(uploadValue).toBeVisible()
    const titleField = drawer.locator('#field-title')
    await expect(titleField).toBeVisible()
    await titleField.fill('Edited title for upload')
    await drawer.locator('button[id="action-save"]').click()
    await expect(drawer).toBeHidden()
    await expect(
      joinField.locator('tbody tr td:nth-child(2)', {
        hasText: exactText('Edited title for upload'),
      }),
    ).toBeVisible()
  })
})
