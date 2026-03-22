/**
 * One-time: set `focus_room_video.tag` from curated title-based categories.
 * Run after migration adds `tag`. Requires DATABASE_URL (e.g. dotenv in apps/web).
 */
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import type { FocusRoomVideoTag } from '../src/db/schema/focus';
import { focusRoomVideo } from '../src/db/schema/focus';

const TAG_BY_VIDEO_ID: Record<string, FocusRoomVideoTag> = {
  ZcZuCcfZfiU: 'Lofi',
  FI3tZiciiKU: 'Lofi',
  KR6vNdeIFaU: 'City',
  SE5ByHj0HDA: 'City',
  jfKfPfyJRdk: 'City',
  u9vK5utTcxE: 'Nature',
  '0_IFFNjuVWk': 'City',
  '5RbH5sc6v2Y': 'Nature',
  KSdANVwpTQs: 'Cafe',
  CLeZyIID9Bo: 'Lofi',
  zUNgUGI9ZbE: 'Cafe',
  HruWhChLto0: 'Cafe',
  ICAmVDO8O6c: 'Cafe',
  '9wRqG2KyAKw': 'Cafe',
  gzmA1kkk660: 'Cafe',
  HdNr5mhfK9o: 'Cafe',
  dMKaKtB9t5k: 'City',
  sckheyO_OVY: 'Cafe',
  Jvz7w0FUOhE: 'Cafe',
  BggKXc_z6kA: 'Cafe',
  liHgt4CbodY: 'Lofi',
  iceaWTWUa6w: 'Cafe',
  '2c5Awu1P8XQ': 'Library',
  dk8Rqv3OKgY: 'Lofi',
  NJuSStkIZBg: 'Cafe',
  'h-PfBxoMq_4': 'Cafe',
  SKJP5vUT2tk: 'Cafe',
  LZfZeW3BYGg: 'Nature',
  QbfXcKs7v_k: 'Nature',
  yHq2gg909BU: 'Nature',
  JZtzIDZiy18: 'Nature',
  'c4WPT9Pd-NM': 'City',
  zbkpshV3tGc: 'Nature',
  qYkhmqjqubA: 'Library',
  o1x872hsr8Y: 'Cafe',
  '4xDzrJKXOOY': 'Lofi',
  SKhpl1OMqEY: 'Lofi',
  _nA5G1WxvsQ: 'Cafe',
  '70p-EUcyIEE': 'Cafe',
  '4df9u9DOFa0': 'Cafe',
  '_O-fxnREF8Y': 'Lofi',
  MwNQHK3EB9k: 'Nature',
  Cl3OVsp5pvc: 'Lofi',
  OaEnFFpgptw: 'Cafe',
  '0-fJS-j_UEE': 'Library',
  Jvgx5HHJ0qw: 'Library',
  rqJDO3TWnac: 'City',
  '1PM6jckIb3U': 'Nature',
  xKsiaTTq2p0: 'Library',
  XEZqqJ2GCQk: 'City',
  r6OMabWgJtg: 'Cafe',
  '-uzFRzb22OM': 'Cafe',
  'NL-NlWeWJPM': 'Nature',
  KDlk2wm4Vnw: 'Library',
  Ume83dO_fe4: 'Nature',
  '8R99w_8bKeQ': 'Library',
  zXluGlZinqg: 'Cafe',
  SC_Uf73_jS4: 'Library',
  RRVwIBQQHy4: 'Nature',
  Qh60c0BDKYs: 'Nature',
  BsbeDtFyHbI: 'Nature',
  'XC_s-c_IJnI': 'City',
  GknkvoCMEIA: 'City',
  Zhaz_30H_0w: 'Library',
  'Ewg1T-VQOe4': 'Library',
  SllpB3W5f6s: 'Library',
  '4M9qCyxSiJs': 'Nature',
  iTC49Hi4hb8: 'Library',
  sAn8WHYDk6o: 'Nature',
  'pjrye-ZSZ-8': 'Library',
  hnX1u_5hP30: 'Nature',
  Rv7dY_Uwyrg: 'City',
  IXsWr2CK4SI: 'Lofi',
  KLGS3yyKgqU: 'City',
  '8UT-QrIXu_8': 'Nature',
  RD929GWcPxo: 'Library',
  bmUlxm6_FnU: 'City',
  pvbX0WOfmlc: 'Library',
  YYqX0uLu5ck: 'City',
  ZjQjmsA5QAg: 'Nature',
  'RKKlFWU-N5s': 'Lofi',
  Tx_OPjvNYbs: 'Library',
  '6WXMivVkiR8': 'Cafe',
  S_bON2ei8iA: 'Lofi',
  BJo2h90J6rA: 'Cafe',
  geygTzDFpfE: 'Nature',
  mCTeVgJ5ehA: 'Cafe',
  'dv7ox-iDM0Y': 'Cafe',
  L99J7UqUqj0: 'Cafe',
  'qDNGP-fVdzo': 'Cafe',
  ZSREV9GC1MY: 'Cafe',
  '_Bb5TK8CX-Q': 'Cafe',
  tWQ4K1H0Fpk: 'Cafe',
  KZ2m7L9xWJ4: 'Cafe',
};

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new pg.Pool({ connectionString: url });
  const db = drizzle(pool);

  const now = new Date();
  await Promise.all(
    Object.entries(TAG_BY_VIDEO_ID).map(([id, tag]) =>
      db
        .update(focusRoomVideo)
        .set({ tag, updatedAt: now })
        .where(eq(focusRoomVideo.id, id))
    )
  );

  await pool.end();
}

main().catch((error: unknown) => {
  process.exitCode = 1;
  throw error;
});
