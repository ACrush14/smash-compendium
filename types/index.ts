import type {
  Fighter,
  FighterBio,
  FighterWork,
  Franchise,
  Game,
  Collectible,
  Stage,
  Music,
  StageMusic,
} from "@prisma/client";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const SMASH_GAME_VERSIONS = [
  "SSB64",
  "SSBM",
  "SSBB",
  "SSB4",
  "SSBU",
] as const;
export type SmashGameVersion = (typeof SMASH_GAME_VERSIONS)[number];

export const COLLECTIBLE_TYPES = ["TROPHY", "SPIRIT", "STICKER"] as const;
export type CollectibleType = (typeof COLLECTIBLE_TYPES)[number];

export const SOURCE_TYPES = ["Official", "Fan_Lore"] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const PLATFORMS = [
  "N64",
  "GameCube",
  "Wii",
  "3DS",
  "WiiU",
  "Switch",
] as const;
export type Platform = (typeof PLATFORMS)[number];

// ─── Rich / Joined types ──────────────────────────────────────────────────────

export type FighterWithRelations = Fighter & {
  franchise: Franchise;
  bios: FighterBio[];
  works: (FighterWork & { game: Game })[];
  collectibles: Collectible[];
};

export type CollectibleWithFighter = Collectible & {
  fighter: Fighter | null;
};

export type GameWithFighters = Game & {
  franchise: Franchise;
  fighterWorks: (FighterWork & { fighter: Fighter })[];
};

export type StageWithTracks = Stage & {
  franchise: Franchise;
  defaultTracks: (StageMusic & { music: Music })[];
};

export type MusicWithStages = Music & {
  franchise: Franchise;
  stages: (StageMusic & { stage: Stage })[];
};

// ─── API Response shapes ──────────────────────────────────────────────────────

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};
