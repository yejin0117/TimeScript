// src/api/groups.ts
import { http } from "./http";

export interface CreateGroupOnlyRequest {
  name: string;
  reason?: string;
  responseDeadline: string; // e.g. 2025-10-05T23:59:00+09:00
}
export interface CreateGroupOnlyResponse {
  groupId: number;
  inviteCode: string;
}

export interface AddMemberRequest {
  inviteCode: string;
  nickname: string;
  password: string;
  departureText?: string;
  preferredAreaText?: string;
  role?: "LEADER" | "MEMBER";
}

export interface AuthResponse {
  groupId: number;
  memberId: number;
  token: string;
}

export interface JoinGroupRequest {
  groupName: string;
  inviteCode: string;
  nickname: string;
  password: string;
  departureText?: string;
  preferredAreaText?: string;
}

export interface AvailabilitySlotDto { start: string; end: string; }
export interface SubmitAvailabilityRequest { slots: AvailabilitySlotDto[]; }

export interface OverlapInterval { startUtc: string; endUtc: string; }
export interface OverlapResult { commonSlots: OverlapInterval[]; suggestedPlace: string; }

export const GroupsApi = {
  createGroupSimple: (req: CreateGroupOnlyRequest) =>
    http.post<CreateGroupOnlyResponse>("/api/groups/simple", req),

  addMember: (groupId: number, req: AddMemberRequest) =>
    http.post<AuthResponse>(`/api/groups/${groupId}/members`, req),

  join: (req: JoinGroupRequest) =>
    http.post<AuthResponse>("/api/groups/join", req),

  submitAvailability: (groupId: number, memberId: number, req: SubmitAvailabilityRequest) =>
    http.post<void>(`/api/groups/${groupId}/members/${memberId}/availability`, req),

  overlap: (groupId: number) =>
    http.get<OverlapResult>(`/api/groups/${groupId}/overlap`),

  complete: (groupId: number) =>
    http.post<void>(`/api/groups/${groupId}/complete`, {}),

  members: (groupId: number) =>
    http.get<Array<{id:number; nickname:string; role:string; departureText?:string; preferredAreaText?:string}>>(
      `/api/groups/${groupId}/members`
    ),
    lookup: (name: string, inviteCode: string) =>
    http.get<{ groupId: number; name: string }>(
      `/api/groups/lookup?name=${encodeURIComponent(name)}&inviteCode=${encodeURIComponent(inviteCode)}`
    ),
};
