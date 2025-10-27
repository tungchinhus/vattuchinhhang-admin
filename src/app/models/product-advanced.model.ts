export interface ProductTechnologies {
  aiotec: boolean;
  hydro_ion: boolean;
  alkaline_direk: boolean;
  nsf_ansi_58: boolean;
  qcvn_6_1_2010_byt: boolean;
}

export interface ProductAttributes {
  water_modes: string[];
  ph_levels: string[];
  electrodes: { hydro_ion: number; alkaline_direk: number };
  filtration_stages_label: string;
}

export interface DimensionsMM {
  w: number;
  d: number;
  h: number;
}

export interface ProductSpecs {
  type: string;
  cooling_tech: string;
  ro_membrane: string;
  flow_rate_lph: number;
  pressure_tank_l: number;
  pure_water_recovery_pct: number;
  num_faucets: number;
  cold_tank_l: number;
  hot_temp_options_c: number[];
  cold_temp_range_c: number[];
  voltage_v_hz: string;
  power_hot_w: number;
  power_cold_w: number;
  dimensions_mm: DimensionsMM;
  weight_kg: number;
  color: string;
  shell_material: string;
}

export interface ReplacementGuidelines {
  smax_pro_v_months_max: number;
  ro_months: number[];
  hydro_ion_months: number[];
  alkaline_direk_months: number[];
  hp62_months_max: number;
}

export interface ProductFiltration {
  prefilters: string[];
  ro: string;
  hydro_ion: string;
  alkaline_direk: string;
  hp62: string[];
  replacement_guidelines: ReplacementGuidelines;
}

export interface ProductCompatibility {
  inlet_water_req: string;
  tds_req_ppm: string;
}

export interface ProductWarranty {
  standard_months: number;
  electrodes_years: number;
  cooling_block_years: number;
  details_url: string;
}

export interface ProductPricing {
  list_price_vnd: number;
  currency: string;
  vat_included: boolean;
}

export type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'preorder';

export interface ProductAvailability {
  status: AvailabilityStatus;
  lead_time_days: number | null;
}

export interface ProductSEO {
  title: string;
  meta_description: string;
  canonical_url: string;
}

export interface ProductMediaItem {
  url: string;
  alt: string;
  sort: number;
}

export interface ProductVideoItem {
  url: string;
  title: string;
}

export interface ProductMedia {
  cover_image: string;
  gallery: ProductMediaItem[];
  videos: ProductVideoItem[];
}

export interface ProductDoc {
  id?: string;
  name: string;
  slug: string;
  brand: string;
  model: string;
  categories: string[];
  description_html: string;
  highlights: string[];
  technologies: ProductTechnologies;
  attributes: ProductAttributes;
  specs: ProductSpecs;
  filtration: ProductFiltration;
  certifications: string[];
  compatibility: ProductCompatibility;
  warranty: ProductWarranty;
  pricing: ProductPricing;
  availability: ProductAvailability;
  seo: ProductSEO;
  media: ProductMedia;
  related_product_ids: string[];
  created_at: any;
  updated_at: any;
}


