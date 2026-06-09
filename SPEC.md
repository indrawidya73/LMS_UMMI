# Laporan Hasil Belajar Mengaji - METODE UMMI
## MI ISLAMIYAH - MALANG

## Concept & Vision

A comprehensive school management web application for MI Islamiyah Malang's Mengaji (Quran reading) program using the METODE UMMI method. The system manages student learning outcomes, attendance, and generates formal reports. Designed for both Guru (teachers) and Siswa (students) with different access levels.

## Design Language

**Aesthetic Direction:** Professional Islamic educational theme - clean, organized, and dignified. Green and gold color scheme reflecting Islamic tradition, with clear data presentation suitable for educational records.

**Color Palette:**
- Primary: #166534 (Islamic green)
- Secondary: #15803D (medium green)
- Accent: #F59E0B (gold/amber)
- Highlight: #FEF3C7 (light yellow for totals)
- Background: #F9FAFB (light gray)
- Card: #FFFFFF (white)
- Text: #1F2937 (dark gray)
- Border: #E5E7EB (light border)

**Typography:**
- Headings: Playfair Display (serif, traditional)
- Body: Inter (clean, readable)
- Monospace: For data tables

**Spatial System:**
- Base unit: 8px
- Card padding: 24px
- Table cell padding: 12px
- Section gaps: 32px

## Layout & Structure

1. **Login Page** - Centered card with school branding, username/password fields, role indicator
2. **Sidebar Navigation** - Fixed left sidebar (collapsible on mobile), logo, menu items
3. **Dashboard** - Statistics cards, recent activity, quick actions
4. **Data Guru** - Teacher management table with add/edit/delete
5. **Data Siswa** - Student management table with class filter
6. **Data Kelas** - Class management (1-6) with add/edit
7. **Tahun Ajaran** - Academic year and semester management (Ganjil/Genap)
8. **Absensi** - Attendance with Excel-like popup editor
9. **Penilaian** - Comprehensive assessment table (spreadsheet-like)
10. **Laporan** - Formal report generation (printable)

## Features & Interactions

**Authentication:**
- Guru login: Full access to all features
- Siswa login: Limited access (view own data, attendance, report)
- Persistent session via localStorage

**Data Management:**
- CRUD operations for Guru, Siswa, Kelas, Tahun Ajaran
- Class filter for student list
- Search functionality
- Pagination for large datasets

**Absensi Excel Popup:**
- Modal with spreadsheet-like interface
- Rows: Students, Columns: Meetings (1-16)
- Each cell: Dropdown with status (H/S/I/A)
- Date column for each meeting
- Save/Cancel buttons
- Color-coded cells (green=H, yellow=S, blue=I, red=A)

**Penilaian Table:**
- Complex multi-column table matching the image
- Jilid dropdown (Jilid 1-6, Al Qur'an, Tajwid, GHORIB)
- Editable cells with auto-calculation
- Color-coded totals (yellow highlight)
- Export to PDF/Print

**Laporan (Report):**
- Formal report format matching the second image
- School header with logo
- Student information section
- MATERI UMMI table
- Ketidakhadiran and Perilaku tables
- Date and signature sections
- Print-optimized layout

**Mobile Responsiveness:**
- Sidebar collapses to hamburger menu
- Tables scroll horizontally
- Cards stack vertically
- Touch-friendly buttons and inputs

## Component Inventory

1. **Login** - Card with form
2. **Sidebar** - Navigation with active states
3. **StatCard** - Dashboard statistics
4. **DataTable** - Reusable table component
5. **Modal** - Reusable modal
6. **ExcelPopup** - Attendance editor
7. **PenilaianTable** - Assessment spreadsheet
8. **LaporanCetak** - Printable report
9. **Button** - Primary, Secondary, Danger variants
10. **Input** - Text, Number, Select, Date variants

## Technical Approach

- React with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- localStorage for data persistence
- Intersection Observer for scroll animations
- Print CSS for report generation
- Responsive design with mobile-first approach