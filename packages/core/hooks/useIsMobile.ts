import breakpoints from "@core/assets/scss/breakpoints.module.scss";
import { onScopeDispose, ref } from "vue";

export default function useIsMobile() {
  const query = window.matchMedia(`(max-width: ${breakpoints.mobile})`);
  const isMobile = ref(query.matches);
  const update = (event: MediaQueryListEvent) => {
    isMobile.value = event.matches;
  };

  query.addEventListener("change", update);
  onScopeDispose(() => query.removeEventListener("change", update), true);

  return isMobile;
}
