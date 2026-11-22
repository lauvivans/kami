import { useStore } from "@core/store";
import { onScopeDispose, provide, ref } from "vue";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, summary, textarea, [tabindex]:not([tabindex="-1"])';

// Open modals, innermost last: only the top one answers Esc and Tab.
const openModals: (() => void)[] = [];

export default function useModal({ provideName }: { provideName: string }) {
  const body = document.body;
  const modalRef = ref<HTMLDivElement | null>(null);
  let opener: HTMLElement | null = null;

  const store = useStore;

  provide(provideName, modalRef);

  let isOpen = false;

  // A link inside an open modal changes the route and unmounts it without
  // hideModal, so give the page its clicks and keys back here.
  onScopeDispose(() => {
    if (isOpen) {
      body.style.pointerEvents = "auto";
      store.storeCurrentModalPageId("");
    }
    forget();
  });

  function forget() {
    const index = openModals.indexOf(hideModal);
    if (index === -1) return;
    openModals.splice(index, 1);
    document.removeEventListener("keydown", handleKeydown);
  }

  function hideModal() {
    if (modalRef.value) {
      isOpen = false;
      modalRef.value.style.display = "none";
      modalRef.value.style.pointerEvents = "";
      body.style.pointerEvents = "auto";

      store.storeCurrentModalPageId("");

      modalRef.value.removeEventListener("click", handleGlobalClick);

      if (!openModals.includes(hideModal)) return;
      forget();

      const active = document.activeElement;
      if (active === body || modalRef.value.contains(active)) opener?.focus();
    }
  }

  function showModal() {
    opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    setTimeout(() => {
      if (modalRef.value) {
        isOpen = true;
        modalRef.value.style.display = "block";
        body.style.pointerEvents = "none";

        modalRef.value.style.pointerEvents = "auto";

        addModalListener();

        if (!openModals.includes(hideModal)) {
          openModals.push(hideModal);
          document.addEventListener("keydown", handleKeydown);
        }
        modalRef.value.querySelector<HTMLElement>("dialog")?.focus();
      }
    }, 250);
  }

  // Items of a nested modal belong to that modal, not to this one.
  function focusables(root: HTMLElement) {
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.closest(".overlay") === root && el.getClientRects().length > 0
    );
  }

  function handleKeydown(e: KeyboardEvent) {
    const root = modalRef.value;
    if (!root || openModals.at(-1) !== hideModal) return;

    if (e.key === "Escape") {
      e.preventDefault();
      hideModal();
      return;
    }

    if (e.key !== "Tab") return;

    const items = focusables(root);
    const first = items[0];
    const last = items.at(-1);
    const active = document.activeElement as HTMLElement;

    if (!first || !last) {
      e.preventDefault();
    } else if (e.shiftKey && (active === first || !items.includes(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !items.includes(active))) {
      e.preventDefault();
      first.focus();
    }
  }

  function handleGlobalClick(e: MouseEvent) {
    if (modalRef.value) {
      const res = Array.from(modalRef.value.querySelectorAll("*")).some(
        (child) => child === e.target
      );

      const refDisplay = modalRef.value.style.display;

      if (refDisplay == "block" && !res) {
        hideModal();
      }
    }
  }

  function addModalListener() {
    // On the overlay, not body: iOS Safari only sends click from a tap on an element with a listener.
    modalRef.value?.addEventListener("click", handleGlobalClick);
  }

  return {
    showModal,
    hideModal,
    addModalListener,
  };
}
