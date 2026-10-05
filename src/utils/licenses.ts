import type { Order, Product } from '@/types'
import { formatDate, hashString } from './format'

/* ------------------------------------------------------------------ */
/*  Mock fulfillment: deterministic license keys + real file          */
/*  downloads (generated client-side as text blobs).                  */
/* ------------------------------------------------------------------ */

const KEY_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export const licenseKey = (productSlug: string, orderNumber: string): string => {
  const h = hashString(`${productSlug}:${orderNumber}`)
  let key = ''
  let n = h
  for (let i = 0; i < 12; i++) {
    key += KEY_ALPHABET[n % KEY_ALPHABET.length]
    n = Math.floor(n / KEY_ALPHABET.length) + 7 * (i + 3)
    if (n === 0) n = h + i
  }
  return `${key.slice(0, 4)}-${key.slice(4, 8)}-${key.slice(8, 12)}`
}

const download = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export const downloadLicense = (product: Product, order: Order): void => {
  const key = licenseKey(product.slug, order.number)
  const content = [
    '════════════════════════════════════════════════════',
    '  AXRYZURE STORE — LICENSE CERTIFICATE',
    '════════════════════════════════════════════════════',
    '',
    `Product        ${product.name} (v${product.version})`,
    `Product ID     ${product.id.toUpperCase()}`,
    `Licensee       ${order.name} <${order.email}>`,
    `Order          ${order.number}`,
    `Purchased      ${formatDate(order.date)}`,
    `License key    AXZ-${key}`,
    '',
    '  LICENSE',
    `  ${product.license}`,
    '',
    '  SUPPORT',
    '  hello@axryzure.store · Median response time: 4 hours',
    '',
    '  Thank you for building with AXRYZURE.',
    '════════════════════════════════════════════════════',
  ].join('\n')
  download(`${product.slug}-license.txt`, content)
}

export const downloadReceipt = (order: Order): void => {
  const lines = order.items.map((i) => `  ${i.qty} × ${i.name} — $${(i.price * i.qty).toFixed(2)}`)
  const content = [
    '════════════════════════════════════════════════════',
    '  AXRYZURE STORE — ORDER RECEIPT',
    '════════════════════════════════════════════════════',
    '',
    `Order           ${order.number}`,
    `Date            ${formatDate(order.date)}`,
    `Customer        ${order.name} <${order.email}>`,
    `Payment method  ${order.paymentMethod}`,
    '',
    '  ITEMS',
    ...lines,
    '',
    `  Subtotal        $${order.subtotal.toFixed(2)}`,
    ...(order.discount > 0
      ? [`  Discount${order.promoCode ? ` (${order.promoCode})` : ''}  −$${order.discount.toFixed(2)}`]
      : []),
    `  Total           $${order.total.toFixed(2)}`,
    '',
    '  Digital goods — VAT included where applicable.',
    '════════════════════════════════════════════════════',
  ].join('\n')
  download(`axryzure-receipt-${order.number}.txt`, content)
}
