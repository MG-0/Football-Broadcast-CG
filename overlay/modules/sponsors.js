import { socket, matchId, timelines } from "./core.js";
import {
  sponsorsGsap,
  renderAndStartSponsors,
  clearSponsorsCarousel,
} from "../animationsGsap.js";

// initialize sponsor graphics and socket listeners
export function initSponsors() {
  const sponsorsWrapper = document.getElementById("sponsors-wrapper");
  const sponsorsTicker = document.getElementById("sponsors-ticker");
  const sponsorsListWrapper = document.getElementById("sponsors-list-wrapper");

  sponsorsGsap(timelines.sponsors, { sponsorsTicker });

  // apply custom screen positions and scales to the sponsors wrapper
  const applyPosition = (settings) => {
    if (sponsorsWrapper) {
      sponsorsWrapper.style.bottom = `calc(45px + ${settings?.yOffset || 0}px)`;
      sponsorsWrapper.style.left = `calc(50% + ${settings?.xOffset || 0}px)`;
      sponsorsWrapper.style.scale = settings?.scale || 1;
    }
  };

  // socket event listeners for sponsor graphics control
  socket.on("sponsors:show", (data) => {
    if (data.matchId !== matchId) return;

    const settings = data.sponsors || {};

    if (settings.isUpdate) {
      applyPosition(settings);
      return;
    }

    applyPosition(settings);

    clearSponsorsCarousel();

    // renders sponsor elements into the wrapper and plays the ticker animation, fetching fallback items if needed
    const loadSponsorsAndPlay = (
      listFromPayload = null,
      selectedIds = null,
    ) => {
      if (listFromPayload) {
        renderAndStartSponsors(
          { sponsorsListWrapper },
          listFromPayload,
          timelines.sponsors,
        );
        return;
      }

      fetch(`/routes/matches/${matchId}/sponsors`)
        .then((res) => res.json())
        .then((resData) => {
          let sponsors = resData.sponsors || [];
          if (selectedIds && Array.isArray(selectedIds)) {
            sponsors = sponsors.filter((s) => selectedIds.includes(s.id));
          }
          if (sponsors.length > 0) {
            renderAndStartSponsors(
              { sponsorsListWrapper },
              sponsors,
              timelines.sponsors,
            );
          }
        })
        .catch((err) =>
          console.error("Failed to load fallback sponsors list:", err),
        );
    };

    loadSponsorsAndPlay(settings.list, settings.selectedSponsorIds);
  });

  socket.on("sponsors:hide", (data) => {
    if (data.matchId !== matchId) return;
    timelines.sponsors.reverse();
  });
}
