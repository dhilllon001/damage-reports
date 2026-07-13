export type UnitType = 'Truck' | 'Trailer'
export type Severity = 'Critical' | 'Major' | 'Medium' | 'Minor' | 'High' | 'Low'
export type ReportStatus =
  | 'Draft'
  | 'Initial'
  | 'Under Investigation'
  | 'Under Repair'
  | 'Invoiced'
  | 'Discarded'
  | 'Closed'
export type DamageCategory = 'Internal' | 'External' | 'Mechanical' | 'Tires'
export type EstimateStatus = 'Pending' | 'Pending repairs' | 'In Progress' | 'Profit' | 'Closed'
export type RequestStatus = 'Open' | 'Closed' | 'Pending'

export interface EstimateItem {
  id: string
  description: string
  part?: string
  quantity: number
  unitCost: number
  currency: 'USD' | 'CAD' | 'MXN'
}

export interface EstimateDocument {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: string
}

export interface WorkorderInfo {
  workorder?: string
  cost?: number
  currency?: 'USD' | 'CAD' | 'MXN'
  potentialRevenueUsd?: number
  estimateStatus: EstimateStatus
}

export interface DamageReport {
  id: string
  claimId?: string
  date: string
  unitType: UnitType
  unitNo: string
  source: string
  severity: Severity
  location: string
  status: ReportStatus
  category: DamageCategory
  estCost?: number
  nextFollowUp?: string
  assignedTo?: string
  reportedBy: string
  driver?: string
  description?: string
  outOfService?: boolean
  photos?: number
  // Estimate fields from Excel
  dateRq?: string
  rqWeek?: number
  dateDelv?: string
  openDays?: number
  liableParty?: string
  requestedBy?: string
  createdBy?: string
  amount?: number
  currency?: 'USD' | 'CAD' | 'MXN'
  amountUsd?: number
  notes?: string
  comments?: string
  elapsedDays?: number
  requestStatus?: RequestStatus
  estimateItems: EstimateItem[]
  documents: EstimateDocument[]
  workorder?: WorkorderInfo
}

export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  type: 'damage' | 'gate' | 'satellite' | 'event'
}
