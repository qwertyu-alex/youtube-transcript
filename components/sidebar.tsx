import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PreviousTranscripts } from "./previous-transcripts";

export function Sidebar() {
  return (
    <SidebarComponent>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Previous Transcripts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <PreviousTranscripts />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </SidebarComponent>
  );
}
