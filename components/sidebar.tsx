import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { PreviousTranscripts } from "./previous-transcripts";

export function Sidebar() {
  return (
    <SidebarComponent>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Previous transcripts</SidebarGroupLabel>
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
