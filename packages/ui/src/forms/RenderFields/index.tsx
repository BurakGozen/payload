'use client'

import { getFieldPaths } from 'payload/shared'
import React, { Fragment, useState } from 'react'

import type { Props } from './types.js'

import { useForm } from '../../forms/Form/context.js'
import { useIntersect } from '../../hooks/useIntersect.js'
import { useFieldComponents } from '../../providers/FieldComponents/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'render-fields'

export { Props }

export const RenderFields: React.FC<Props> = (props) => {
  const { className, fields, forceRender, margins, parentPath } = props

  const { getFields } = useForm()

  const [formFields] = useState(() => getFields())

  const { i18n } = useTranslation()

  const [hasRendered, setHasRendered] = React.useState(Boolean(forceRender))

  const [intersectionRef, entry] = useIntersect(
    {
      rootMargin: '1000px',
    },
    Boolean(forceRender),
  )

  const isIntersecting = Boolean(entry?.isIntersecting)
  const isAboveViewport = entry?.boundingClientRect?.top < 0
  const shouldRender = forceRender || isIntersecting || isAboveViewport
  const fieldComponents = useFieldComponents()

  React.useEffect(() => {
    if (shouldRender && !hasRendered) {
      setHasRendered(true)
    }
  }, [shouldRender, hasRendered])

  if (!formFields) {
    return <p>No fields to render</p>
  }

  if (!fieldComponents) {
    throw new Error('Field components not found')
  }

  if (!i18n) {
    console.error('Need to implement i18n when calling RenderFields') // eslint-disable-line no-console
  }

  if (fields && fields.length > 0) {
    return (
      <div
        className={[
          baseClass,
          className,
          margins && `${baseClass}--margins-${margins}`,
          margins === false && `${baseClass}--margins-none`,
        ]
          .filter(Boolean)
          .join(' ')}
        ref={intersectionRef}
      >
        {fields.map((field, i) => {
          const { path } = getFieldPaths({
            field,
            parentPath,
            parentSchemaPath: [],
            schemaIndex: i,
          })

          const CustomField = formFields[path.join('.')]?.customComponents?.Field

          const DefaultField = fieldComponents?.[field?.type]

          if (field.hidden || field.admin?.hidden) {
            return null
          }

          return (
            <Fragment key={i}>
              {CustomField ? (
                CustomField
              ) : (
                // TODO: Pass other properties
                <DefaultField
                  field={field}
                  key={i}
                  path={path.join('.')}
                  schemaPath={field._schemaPath.join('.')}
                />
              )}
            </Fragment>
          )
        })}
      </div>
    )
  }

  return null
}
