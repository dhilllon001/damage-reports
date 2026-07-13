import type {
  DamageReport,
  DetailPhoto,
  InvestigationNote,
  InvoiceLine,
  RepairJob,
  TimelineEvent,
} from '@/types'

export const RATES = { usdCad: 1.41, usdMxn: 17.49 }

const baseItems = [
  {
    unitNo: '89979MSM',
    date: '2025-11-06T10:00:00',
    dateRq: '6-Nov',
    rqWeek: 45,
    dateDelv: '1-Dec',
    liableParty: 'South Shore Pallets',
    requestedBy: 'Omar Serrano',
    amount: 27482.17,
    currency: 'CAD' as const,
    amountUsd: 19433.02,
    notes: '25 Panel and 25 Post',
    comments: 'In december',
    elapsedDays: 25,
    requestStatus: 'Closed' as const,
    severity: 'Major' as const,
    category: 'External' as const,
    status: 'Closed' as const,
    unitType: 'Trailer' as const,
    description: 'Panel and post damage across rear section.',
    workorder: {
      workorder: '637625',
      cost: 113,
      currency: 'CAD' as const,
      potentialRevenueUsd: 228.52,
      estimateStatus: 'Profit' as const,
    },
  },
  {
    unitNo: '12257MSM',
    date: '2025-11-08T14:20:00',
    dateRq: '8-Nov',
    rqWeek: 45,
    dateDelv: '3-Dec',
    liableParty: 'CUSTOMER',
    requestedBy: 'Genevieve',
    amount: 4820.5,
    currency: 'CAD' as const,
    amountUsd: 3418.79,
    notes: 'Door',
    comments: '',
    elapsedDays: 4,
    requestStatus: 'Closed' as const,
    severity: 'Medium' as const,
    category: 'External' as const,
    status: 'Under Repair' as const,
    unitType: 'Trailer' as const,
    description: 'Doors damaged.',
    workorder: { estimateStatus: 'Pending repairs' as const },
  },
  {
    unitNo: '99988MSM',
    date: '2026-03-30T15:24:00',
    dateRq: '30-Mar',
    rqWeek: 14,
    dateDelv: '',
    liableParty: 'DRIVER',
    requestedBy: 'H. Singh',
    amount: undefined,
    currency: 'CAD' as const,
    amountUsd: undefined,
    notes: 'Doors damaged',
    comments: '',
    elapsedDays: 9,
    requestStatus: 'Open' as const,
    severity: 'High' as const,
    category: 'External' as const,
    status: 'Draft' as const,
    unitType: 'Trailer' as const,
    description: 'Doors damaged.',
    outOfService: true,
    workorder: { estimateStatus: 'Pending' as const },
  },
  {
    unitNo: '44102MSM',
    date: '2025-10-12T09:10:00',
    dateRq: '12-Oct',
    rqWeek: 41,
    dateDelv: '28-Oct',
    liableParty: 'Ford',
    requestedBy: 'Omar Serrano',
    amount: 9120,
    currency: 'USD' as const,
    amountUsd: 9120,
    notes: 'Roof',
    comments: '',
    elapsedDays: 85,
    requestStatus: 'Closed' as const,
    severity: 'Critical' as const,
    category: 'External' as const,
    status: 'Invoiced' as const,
    unitType: 'Trailer' as const,
    description: 'Roof puncture near front rail.',
    workorder: {
      workorder: '638104',
      cost: 6400,
      currency: 'USD' as const,
      potentialRevenueUsd: 9120,
      estimateStatus: 'Profit' as const,
    },
  },
  {
    unitNo: '77821TRK',
    date: '2026-02-18T11:45:00',
    dateRq: '18-Feb',
    rqWeek: 8,
    dateDelv: '',
    liableParty: 'CARRIER',
    requestedBy: 'Lakhwinder',
    amount: 2150,
    currency: 'CAD' as const,
    amountUsd: 1524.82,
    notes: 'Front Axle damage',
    comments: '',
    elapsedDays: 12,
    requestStatus: 'Open' as const,
    severity: 'Major' as const,
    category: 'Mechanical' as const,
    status: 'Under Investigation' as const,
    unitType: 'Truck' as const,
    description: 'Front axle housing scuffed; inspection required.',
    workorder: { estimateStatus: 'Pending repairs' as const },
  },
  {
    unitNo: '33019MSM',
    date: '2026-01-05T16:00:00',
    dateRq: '5-Jan',
    rqWeek: 1,
    dateDelv: '20-Jan',
    liableParty: 'Labatt',
    requestedBy: 'Genevieve',
    amount: 680,
    currency: 'CAD' as const,
    amountUsd: 482.27,
    notes: 'Tire',
    comments: '',
    elapsedDays: 6,
    requestStatus: 'Closed' as const,
    severity: 'Minor' as const,
    category: 'Tires' as const,
    status: 'Closed' as const,
    unitType: 'Trailer' as const,
    description: 'Outer tire sidewall cut.',
    workorder: {
      workorder: '639001',
      cost: 420,
      currency: 'CAD' as const,
      potentialRevenueUsd: 482.27,
      estimateStatus: 'Closed' as const,
    },
  },
]

const locations = [
  '1276 Commerce Way, Woodstock, Ontario',
  '880 Gateway Blvd, Mississauga, Ontario',
  '214 Industrial Pkwy, Brampton, Ontario',
  '55 Dock Road, Detroit, Michigan',
  '1900 Logistics Dr, Chicago, Illinois',
]

const reporters = ['H. Singh', 'Lakhwinder@charger.com', 'Omar Serrano', 'Genevieve', 'Aditika Verma', 'Harjinder Singh']
const drivers = ['Harjinder Singh', 'Manpreet Kaur', 'Jasbir Gill', 'Ravi Patel', 'Sukhdeep Dhillon']

function seedReports(): DamageReport[] {
  const reports: DamageReport[] = baseItems.map((item, i) => ({
    id: String(1774898683965 + i),
    claimId: i % 3 === 0 ? `CLM-${9000 + i}` : undefined,
    date: item.date,
    unitType: item.unitType,
    unitNo: item.unitNo,
    source: i % 2 === 0 ? 'Gate Camera' : 'Driver App',
    severity: item.severity,
    location: locations[i % locations.length],
    status: item.status,
    category: item.category,
    estCost: item.amountUsd,
    assignedTo: i === 2 ? undefined : reporters[i % reporters.length],
    reportedBy: reporters[i % reporters.length],
    driver: drivers[i % drivers.length],
    description: item.description,
    outOfService: 'outOfService' in item ? Boolean(item.outOfService) : false,
    photos: i === 2 ? 1 : (i % 4) + 1,
    dateRq: item.dateRq,
    rqWeek: item.rqWeek,
    dateDelv: item.dateDelv,
    openDays: item.elapsedDays,
    liableParty: item.liableParty,
    requestedBy: item.requestedBy,
    createdBy: 'Aditika Verma',
    amount: item.amount,
    currency: item.currency,
    amountUsd: item.amountUsd,
    notes: item.notes,
    comments: item.comments,
    elapsedDays: item.elapsedDays,
    requestStatus: item.requestStatus,
    estimateItems:
      item.amount && item.amount > 0
        ? [
            {
              id: `ei-${i}-1`,
              description: item.notes || 'Repair labor',
              part: item.notes,
              quantity: 1,
              unitCost: item.amount,
              currency: item.currency,
            },
          ]
        : [],
    documents: [],
    workorder: item.workorder,
  }))

  // Pad with draft-style rows so pagination / filters feel real
  for (let i = 0; i < 42; i++) {
    const n = reports.length + i
    const isTruck = i % 5 === 0
    reports.push({
      id: String(1774898684000 + n),
      date: new Date(2026, 2, 1 + (i % 28), 8 + (i % 10), 15).toISOString(),
      unitType: isTruck ? 'Truck' : 'Trailer',
      unitNo: isTruck ? `${70000 + i}TRK` : `${80000 + i}MSM`,
      source: i % 3 === 0 ? 'Satellite' : i % 3 === 1 ? 'Gate Camera' : 'Manual',
      severity: (['Medium', 'Medium', 'Medium', 'High', 'Low', 'Critical'] as const)[i % 6],
      location: locations[i % locations.length],
      status: (['Draft', 'Draft', 'Draft', 'Initial', 'Under Investigation'] as const)[i % 5],
      category: (['Internal', 'External', 'External', 'Mechanical', 'Tires'] as const)[i % 5],
      reportedBy: reporters[i % reporters.length],
      driver: drivers[i % drivers.length],
      description: ['Doors damaged.', 'Side panel dent.', 'Bumper scrape.', 'Tire wear.', 'Frame rail nick.'][i % 5],
      photos: i % 3,
      createdBy: 'Aditika Verma',
      currency: 'CAD',
      liableParty: ['CUSTOMER', 'DRIVER', 'CARRIER', 'Ford'][i % 4],
      requestStatus: 'Open',
      estimateItems: [],
      documents: [],
      workorder: { estimateStatus: 'Pending' },
    })
  }

  return reports
}

export const INITIAL_REPORTS = seedReports()

export function buildTimeline(report: DamageReport): TimelineEvent[] {
  const base = new Date(report.date).getTime()
  return [
    {
      id: `${report.id}-t1`,
      date: new Date(base - 45 * 60 * 1000).toISOString(),
      title: 'Gate activity scanned',
      description: `${report.unitType} ${report.unitNo} passed gate camera at yard entrance.`,
      type: 'gate',
      location: report.location,
      actor: 'Gate Camera',
      images: [
        `https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=480&h=320&fit=crop&q=80`,
      ],
    },
    {
      id: `${report.id}-t2`,
      date: report.date,
      title: 'Damage reported',
      description: report.description ?? report.notes ?? 'Damage event recorded',
      type: 'damage',
      location: report.location,
      actor: report.reportedBy,
      images: [
        `https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=480&h=320&fit=crop&q=80`,
        `https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=480&h=320&fit=crop&q=80`,
      ],
    },
    {
      id: `${report.id}-t3`,
      date: new Date(base + 2 * 60 * 60 * 1000).toISOString(),
      title: 'Satellite location ping',
      description: `Unit tracked near ${report.location.split(',')[0] ?? 'reported site'}.`,
      type: 'satellite',
      location: report.location,
      actor: 'Telematics',
    },
    {
      id: `${report.id}-t4`,
      date: new Date(base + 26 * 60 * 60 * 1000).toISOString(),
      title: 'Investigation note added',
      description: `Liable party marked as ${report.liableParty ?? 'pending review'}. Photos reviewed by claims team.`,
      type: 'event',
      actor: report.assignedTo ?? 'Claims Desk',
      images: [
        `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=480&h=320&fit=crop&q=80`,
      ],
    },
  ]
}

export function buildDetailPhotos(report: DamageReport): DetailPhoto[] {
  return [
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=640&h=420&fit=crop&q=80',
      caption: 'Rear panel damage — left side',
      takenAt: report.date,
    },
    {
      id: 'p2',
      url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=640&h=420&fit=crop&q=80',
      caption: 'Close-up of post impact',
      takenAt: report.date,
    },
    {
      id: 'p3',
      url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=640&h=420&fit=crop&q=80',
      caption: 'Full unit context at yard',
      takenAt: report.date,
    },
    {
      id: 'p4',
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=640&h=420&fit=crop&q=80',
      caption: 'Door seal inspection',
      takenAt: report.date,
    },
  ]
}

export function buildInvestigationNotes(report: DamageReport): InvestigationNote[] {
  return [
    {
      id: 'n1',
      author: report.assignedTo ?? 'Aditika Verma',
      date: report.date,
      note: `Initial review completed. Damage aligns with ${report.notes ?? 'reported area'}. Awaiting liable party confirmation.`,
      status: 'In review',
    },
    {
      id: 'n2',
      author: 'Claims Desk',
      date: new Date(new Date(report.date).getTime() + 5 * 60 * 60 * 1000).toISOString(),
      note: `Driver statement collected from ${report.driver ?? 'on-file driver'}. Gate footage attached to case.`,
      status: 'Evidence added',
    },
  ]
}

export function buildInvoices(report: DamageReport): InvoiceLine[] {
  if (!report.amount) {
    return [
      {
        id: 'inv-draft',
        number: `INV-DRAFT-${report.id.slice(-4)}`,
        date: report.date,
        amount: 0,
        currency: report.currency ?? 'CAD',
        status: 'Draft',
      },
    ]
  }
  return [
    {
      id: 'inv-1',
      number: `INV-${report.workorder?.workorder ?? report.id.slice(-6)}`,
      date: report.dateDelv ? `2025-${report.dateDelv}` : report.date,
      amount: report.amount,
      currency: report.currency ?? 'CAD',
      status: report.status === 'Closed' || report.status === 'Invoiced' ? 'Paid' : 'Sent',
    },
  ]
}

export function buildRepairJobs(report: DamageReport): RepairJob[] {
  return [
    {
      id: 'rj1',
      action: 'Move to Vendor',
      vendor: 'Woodstock Trailer Repair',
      scheduled: '2025-11-12',
      status: report.status === 'Under Repair' ? 'In progress' : 'Scheduled',
    },
    {
      id: 'rj2',
      action: 'Parts order',
      vendor: 'Panel Supply Co.',
      scheduled: '2025-11-10',
      status: 'Ordered',
    },
  ]
}

export const DAMAGE_TYPES = [
  'Front Bumper Grille',
  'Hood Engine Cover',
  'Headlights Fog Lights',
  'Side Fender Doors',
  'Windshield Windows',
  'Fuel Tanks',
  'Exhaust System',
  'Frame Rails',
  'Rear Doors',
  'Roof',
  'Side Panels',
  'Landing Gear',
  'Axle Suspension',
  'Tires Wheels',
  'Lights Wiring',
  'Mud Flaps',
]
