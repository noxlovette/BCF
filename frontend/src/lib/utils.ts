
export function handleKeydown(searchInput, toggleOverlay, changePage, searchTerm) {
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
        } else {
          event.preventDefault();
          toggleOverlay();
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
  

  async function changePage(increment, currentPage, totalPages, notification) {
    if (
      currentPage + increment >= 1 &&
      currentPage + increment <= totalPages
    ) {
      currentPage.update((value) => value + increment);
      notification.set({
        message: `you are on page ${currentPage}`,
        type: "info",
      });
    } else {
      notification.set({
        message: `there is nothing to seek there`,
        type: "error",
      });
    }
  }

