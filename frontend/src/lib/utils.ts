import { writable } from "svelte/store";
import { notification } from "./stores/notificationStore";


export function handleKeydown(searchInput, changePage, searchTerm) {
    return (event) => {
      if (event.key === "/") {
        event.preventDefault();
  
        if (document.activeElement === searchInput) {
          searchInput.blur();
        } else {
          searchInput.focus();
        }
      } else if (event.key === "Escape") {
        if (document.activeElement === searchInput) {
          searchInput.blur();
          searchTerm.set("");
        }
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        changePage(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        changePage(+1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        changePage(-1);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        changePage(+1);
      }
    };
  }
  

export async function changePage(
  increment: number, total_pages:number, currentPage:number

) {
  try {
    const newPage: number = currentPage + increment;

    // Check if new page is within valid range
    if (newPage < 1 || newPage > total_pages) {
      notification.set({
        message: `There is nothing to seek there`,
        type: "error",
      });
      return currentPage;
    }

    // Update the current page
    const message = `You are on page ${newPage}/${total_pages}`;
    notification.set({ message: message, type: "info" });
    return currentPage += increment;


  } catch (error) {
    console.error("An error occurred:", error);
    notification.set({
      message: "An unexpected error occurred. Please try again.",
      type: "error",
    });

    // Roll back the page update in case of error
    return currentPage -= increment;
  }
}
