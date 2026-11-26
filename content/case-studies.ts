export type Img = { src: string; alt: string; width: number; height: number };

export type Block =
  | {
      type: "text";
      heading?: string;
      body: string;
      note?: string;
      link?: { label: string; href: string };
    }
  | { type: "image"; image: Img; caption: string; wide?: boolean }
  | { type: "pair"; images: [Img, Img]; caption: string }
  | {
      type: "loop";
      src: string;
      poster: string;
      label: string;
      caption: string;
      phone?: boolean;
      width?: number;
    }
  | {
      type: "switch";
      items: { label: string; image: Img }[];
      caption: string;
    }
  | { type: "code"; file: string; lang: string; code: string; caption?: string }
  | { type: "terminal"; lines: string[] }
  | { type: "list"; heading?: string; items: { title: string; body: string }[] }
  | { type: "quote"; text: string; source: string };

export type CaseStudy = {
  slug: string;
  name: string;
  icon: string;
  line: string;
  facts: { label: string; value: string }[];
  links: { label: string; href: string }[];
  blocks: Block[];
};

const vscrybeCode = `const SHORT_BURST: usize = RATE * 3 / 2;

const PHANTOMS: &[(&str, &[&str])] = &[(
    "en",
    &["you", "thank you", "thank you very much", "thanks",
      "thanks for watching", "thank you for watching", "shh", "shhh"],
)];
…
let doubtful = attempt.no_speech_prob > NO_SPEECH_LIMIT
    || chunk.len() < SHORT_BURST;
found.retain(|s| s.text.chars().any(char::is_alphanumeric)
    && !(doubtful && is_phantom(&s.text, &language)));`;

const basebandCode = `export function resolveHeadline(input: HeadlineInput): Headline {
  const { carrierProfiled, balance, usage, status } = input;

  if (carrierProfiled && balance) {
    const usable = spendable(balance.bundles);
    if (usable.length > 0) {
      return { rung: "data-left", … };
    }
  }

  if (usage && usage.bytes > 0) {
    return { rung: "used-this-month", bytes: usage.bytes };
  }

  if (status?.reachable) {
    return { rung: "connection", … };
  }

  return { rung: "not-identified" };
}`;

const basebandMotion = `export const morph = LinearTransition.springify()
  .stiffness(Motion.spring.gentle.stiffness)
  .damping(Motion.spring.gentle.damping)
  .reduceMotion(ReduceMotion.System);

export const contentIn = FadeIn.duration(
  Motion.surfaceIn.duration,
).reduceMotion(ReduceMotion.System);`;

const basebandSheet = `const hide = useCallback(
  (velocity = 0) => {
    "worklet";
    leaving.set(true);
    …
    const distance = Math.max(0, height.get() - offset.get());
    const flung = velocity > 0 ? (3000 * distance) / velocity : Infinity;
    const duration = Math.max(
      Motion.sheetOut.min,
      Math.min(Motion.sheetOut.duration, flung),
    );
    offset.set(slide(height.get(), duration, done));
  },
  …
);`;

const fillyrFit = `const fits = (size: number) => {
  ctx.font = fontSpec(style, size)
  const lines = wrapText(ctx, text || " ", width)
  if (lines.length * size * lineHeight > height) return false
  return lines.every((line) => ctx.measureText(line).width <= width)
}
…
while (lo <= hi) {
  const mid = (lo + hi) >> 1
  if (fits(mid)) {
    best = mid
    lo = mid + 1
  } else {
    hi = mid - 1
  }
}`;

const fillyrProject = `export function projectField(field: FlyerField, from: Size, to: Size) {
  const scaleX = to.w / Math.max(from.w, 1)
  const scaleY = to.h / Math.max(from.h, 1)

  return {
    ...field,
    x: field.x * scaleX,
    y: field.y * scaleY,
    width: field.width * scaleX,
    height: field.height * scaleY,
    …
  }
}`;

const waysdropMutation = `"use client"
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseQueryOptions,
  UseMutationResult,
  UseMutationOptions,
} from "@tanstack/react-query"
import api from "@/lib/axios"
import { ApiError } from "@/types"
import { AxiosError } from "axios"

export function useApiQuery<TResponse>(
  key: unknown[],
  url: string,
  options?: Omit<
    UseQueryOptions<TResponse, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<TResponse, AxiosError<ApiError>> {
  return useQuery<TResponse, AxiosError<ApiError>>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<TResponse>(url)
      return data
    },
    ...options,
  })
}

function stripRouteKeys<T extends object>(variables: T): Omit<T, \`_\${string}\`> {
  return Object.fromEntries(
    Object.entries(variables).filter(([k]) => !k.startsWith("_"))
  ) as Omit<T, \`_\${string}\`>
}

export function useApiMutation<TResponse, TVariables = unknown>(
  url: string | ((variables: TVariables) => string),
  method: "post" | "put" | "patch" | "delete",
  options?: Omit<
    UseMutationOptions<TResponse, AxiosError<ApiError>, TVariables>,
    "mutationFn"
  >
): UseMutationResult<TResponse, AxiosError<ApiError>, TVariables, unknown> {
  return useMutation<TResponse, AxiosError<ApiError>, TVariables, unknown>({
    mutationFn: async (variables) => {
      const resolvedUrl =
        typeof url === "function" ? url(variables) : url
      const body =
        variables && typeof variables === "object"
          ? stripRouteKeys(variables as object)
          : variables
      const { data } = await api.request<TResponse>({
        url: resolvedUrl,
        method,
        data: body,
      })
      return data
    },
    ...options,
  })
}`;

const waysdropMarkers = `const toRemove = Array.from(existingLocationIds).filter(
  (id) => !newLocationIds.has(id),
);
toRemove.forEach((id) => {
  removeMarker(id);
  locationsMapRef.current.delete(id);
});

newLocations.forEach((location) => {
  const existing = locationsMapRef.current.get(location.id);
  if (!existing) {
    locationsMapRef.current.set(location.id, location);
    updateMarkerPosition(location);
  } else if (existing.lat !== location.lat || existing.lng !== location.lng) {
    …
    updateMarkerPosition(location);
  }
});`;

const waysdropSocket = `socket = io(serverUrl, {
  transports: ['websocket', 'polling'],
  auth: {
    ...(token ? { token } : {}),
    ...(visitorId ? { visitorId } : {}),
  },
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 10000,
})`;

export const caseStudies: CaseStudy[] = [
  {
    slug: "vscrybe",
    name: "VScrybe",
    icon: "/icons/vscrybe.png",
    line: "Voice notes to text, right on your own computer.",
    facts: [
      { label: "Role", value: "Design and engineering, start to finish" },
      {
        label: "Built with",
        value: "Tauri 2, Rust, OpenAI's open Whisper models",
      },
      { label: "Runs on", value: "Linux, macOS and Windows" },
      { label: "License", value: "MIT, free" },
    ],
    links: [
      {
        label: "vscrybe.dalgoridim.com",
        href: "https://vscrybe.dalgoridim.com",
      },
      { label: "GitHub", href: "https://github.com/Invalid8/vscrybe" },
    ],
    blocks: [
      {
        type: "image",
        wide: true,
        image: {
          src: "/work/vscrybe-dark.png",
          alt: "A VScrybe session with voice notes, their transcripts and timestamps",
          width: 2560,
          height: 1600,
        },
        caption: "A session of voice notes, transcribed on a laptop, offline.",
      },
      {
        type: "text",
        body: "Half my conversations arrive as WhatsApp voice notes. I wanted to search them, quote them and skim them without sending anyone's voice to a server I don't control. VScrybe runs Whisper on your own computer. These are four of the small parts.",
      },
      {
        type: "text",
        heading: "A timestamp you can click",
        body: "Every line starts with the second it was said. Click it and the note plays from there, and the line being spoken stays lit while it plays. Starting one note pauses every other. You can listen while a note is still transcribing, and when the text arrives and the card redraws, playback carries on from the same second instead of stopping.",
      },
      {
        type: "image",
        wide: true,
        image: {
          src: "/work/vscrybe/note-live-line.png",
          alt: "A transcribed note playing from 0:18, with that line highlighted",
          width: 1696,
          height: 946,
        },
        caption: "Clicked 0:18. The line stays lit while it plays.",
      },
      {
        type: "text",
        heading: "Nothing starts until you press Send",
        body: "Files you add wait in a tray above the composer until you press Send. Listen to one first, remove it, or add the same file twice and be told it's already there. The tray lives in the browser's IndexedDB, so it's still there after a restart. I dropped the \"Adding N voice notes\" overlay: the copies are local and finish almost at once, so it only flashed on screen.",
      },
      {
        type: "image",
        wide: true,
        image: {
          src: "/work/vscrybe/tray-waiting.png",
          alt: "Two files waiting in the tray above the composer, the first playing as a preview",
          width: 1654,
          height: 314,
        },
        caption:
          "Two waiting, the first playing as a preview. Both are still here after a restart.",
      },
      {
        type: "text",
        heading: "Lines Whisper made up",
        body: 'Whisper invents text when there\'s little to hear: "Thank you.", "You" and "Shh." turned up as lines in quiet and noisy stretches. Filtering those phrases everywhere would delete real thanks, so they\'re only dropped when the model already doubts there\'s speech, or the burst is under a second and a half. Lines with no words at all, a lone ".", go too.',
      },
      {
        type: "code",
        file: "src-tauri/src/engine/transcribe.rs",
        lang: "rust",
        code: vscrybeCode,
        caption: "Excerpt, trimmed with …",
      },
      {
        type: "text",
        body: "The bigger loss was silent. When Whisper ended a 30-second window after its first sentence, the rest was thrown away; one test note lost 19 seconds. Decoding now resumes from the last timestamp, retries low-confidence output at rising temperatures and discards repetition loops. Every encoding of the same note now gives 144 to 150 words, where it gave 99 to 136.",
      },
      {
        type: "text",
        heading: "The same engine, as a command",
        body: "The app's binary is also a command line tool. Point it at files or a whole folder and it writes a .txt beside each recording, skipping any that already have one, so a folder of voice notes can be kept up to date by running the same line again.",
      },
      {
        type: "terminal",
        lines: [
          "$ vscrybe transcribe --help",
          "Transcribe files or folders, writing a .txt next to each",
          "",
          "Usage: vscrybe transcribe [OPTIONS] <PATHS>...",
          "",
          "Options:",
          "  -m, --model <MODEL>        small (Fast), large-v3-turbo (Accurate), or a model you added (see `vscrybe models`) [default: small]",
          "  -l, --language <LANGUAGE>  Language spoken in the recordings, as a code such as en, fr or yo [default: en]",
          "  -t, --timestamps           Prefix each line with [m:ss]",
          "  -f, --force                Redo files that already have a .txt",
          "      --stdout               Print transcripts instead of writing files",
          "  -h, --help                 Print help",
        ],
      },
      {
        type: "text",
        body: "Its progress knows where it's printing. In a terminal it rewrites one line in place, with an estimate of time left. Piped into a log, that would be thousands of carriage returns, so it prints a plain line every 10% or every 30 seconds instead, and ends each file with how long the audio was and how long it took.",
      },
      {
        type: "terminal",
        lines: [
          "$ vscrybe transcribe jfk.opus long1.opus 2>&1 | cat",
          "...   jfk.opus",
          "      100%  0:11 / 0:11  jfk.opus",
          "done  jfk.txt  0:11 of audio in 0:09 (1.2× real time)",
          "...   long1.opus",
          "        0%  0:00 / 0:33  long1.opus",
          "       66%  0:22 / 0:33  long1.opus",
          "      100%  0:33 / 0:33  long1.opus",
          "done  long1.txt  0:33 of audio in 1:00 (0.5× real time)",
        ],
      },
      {
        type: "text",
        body: "It's free for Linux, macOS and Windows, and nothing you transcribe leaves your computer.",
        link: {
          label: "Download VScrybe",
          href: "https://vscrybe.dalgoridim.com/download/",
        },
      },
    ],
  },
  {
    slug: "baseband",
    name: "Baseband",
    icon: "/icons/baseband.png",
    line: "Your router, managed from your phone.",
    facts: [
      { label: "Role", value: "Design and engineering, start to finish" },
      { label: "Built with", value: "Expo, React Native, Reanimated, Skia" },
      { label: "Price", value: "Free, supported by donations" },
    ],
    links: [
      {
        label: "baseband.dalgoridim.com",
        href: "https://baseband.dalgoridim.com",
      },
    ],
    blocks: [
      {
        type: "text",
        body: "I built the first Baseband in April, for my own MiFi. It talks to the router over its own Wi-Fi: no internet, no account and no server in between. In September I went back, audited it screen by screen, and redrew and rebuilt all of it, from the mark to the motion.",
      },
      {
        type: "pair",
        images: [
          {
            src: "/work/baseband/hub-before.png",
            alt: "The first Baseband hub: every block in an identical card, yellow accents everywhere",
            width: 1080,
            height: 1680,
          },
          {
            src: "/work/baseband/hub-after.png",
            alt: "The redrawn hub: one large data-left figure, the speed trace and plain rows, with no cards",
            width: 1080,
            height: 1680,
          },
        ],
        caption:
          "The hub in April, captured from my phone, and as redrawn in September.",
      },
      {
        type: "text",
        heading: "It started with an audit of my own app",
        body: "I captured all 21 screens over adb against the real router and wrote down where they failed before drawing anything. Everything was a card, so the balance and a settings row weighed the same. Yellow marked icons, buttons, links and badges alike, so it pointed at nothing. States were never designed, only defaulted: a broken link opened a blank black screen. The rules for the redesign came straight from that list: one question per screen, never state more than is known, every state drawn.",
      },
      {
        type: "text",
        body: "Then the system, on one canvas: a mark in four rounds, IBM Plex Sans chosen over Geist, Space Grotesk and Inter Tight, and azure picked after every candidate was drawn in both themes. Blue then stopped meaning download in the speed chart, which moved to teal and violet.",
      },
      {
        type: "text",
        heading: "Never state more than is known",
        body: "The hub used to lead with a data balance read from the carrier's SMS, which only works on a network the app knows. Everywhere else it showed an empty card apologising for itself. Now the headline walks down a ladder to the first thing it can actually answer: data left, else the router's own monthly counter, else the connection, else nothing is claimed at all. The counter says it's the router's, so nobody mistakes it for their bill, and a YouTube bonus is shown but never added to the total, because it won't open a web page.",
      },
      {
        type: "switch",
        items: [
          {
            label: "1 · Data left",
            image: {
              src: "/work/baseband/rung-1.png",
              alt: "Hub headline: 7.63 GB data left, from the network",
              width: 1170,
              height: 780,
            },
          },
          {
            label: "2 · Used this month",
            image: {
              src: "/work/baseband/rung-2.png",
              alt: "Hub headline: 60.33 GB used this month, counted by the router",
              width: 1170,
              height: 780,
            },
          },
          {
            label: "3 · Connection",
            image: {
              src: "/work/baseband/rung-3.png",
              alt: "Hub headline: Online, the router reports no usage counter",
              width: 1170,
              height: 780,
            },
          },
          {
            label: "4 · Not identified",
            image: {
              src: "/work/baseband/rung-4.png",
              alt: "Hub headline: router not identified",
              width: 1170,
              height: 780,
            },
          },
        ],
        caption:
          "The same headline on four routers. Rung 3 needs a router that reports its status but no monthly counter, which the MF935 never does, so it's covered by tests until a second model turns up.",
      },
      {
        type: "code",
        file: "lib/hub/headline.ts",
        lang: "ts",
        code: basebandCode,
        caption: "Excerpt, trimmed with …",
      },
      {
        type: "text",
        heading: "Unknown isn't unsupported",
        body: "Capabilities were eleven booleans, so false meant three things at once: this model can't, we never found out, and we never wrote it. Now each one has four states and a reason. Unsupported stays on screen, disabled, with the reason under it. Unknown is offered with a small dot, and when the router carries it out it upgrades itself to supported, remembered by model and firmware so it survives a restart. Not written yet draws nothing. Deleting a message was the first write ever confirmed on this firmware.",
      },
      {
        type: "loop",
        src: "/work/baseband/action-loop.mp4",
        poster: "/work/baseband/action-loop.jpg",
        label:
          "The Reboot button: unknown with a dot, tapped, Rebooting… in the same place, then supported without the dot",
        caption:
          "Unknown, tapped, pending in the same place, then supported. Rebuilt in HTML from the design's own values.",
      },
      {
        type: "text",
        heading: "One sheet under every drawer",
        body: "The first drawers were hand-animated modals that travelled a fixed 400 or 600px and vanished the moment they were told to close, so they could never animate out. Every drawer now sits on one Sheet. It stays mounted until its exit finishes, travels exactly its measured height, follows the finger, and decides on release whether to close or spring back by projecting where the flick would land. It rides the keyboard frame by frame, never shrinks below the tallest state it has shown, and refuses the backdrop, the drag and Android's back while its own Cancel is disabled.",
      },
      {
        type: "text",
        body: "It leaves on a timed slide, not a spring. A sheet is its own native window, and a spring still settling after the sheet had gone kept that window up and swallowed the next tap. Opened from a tab, it once stood 83px too tall: the home indicator's 34 plus the tab bar's 49, inherited by the modal, so its inset now comes from the window itself.",
      },
      {
        type: "loop",
        phone: true,
        src: "/work/baseband/sheet-loop.mp4",
        poster: "/work/baseband/sheet-loop.jpg",
        label:
          "A sheet opens to its measured height, springs back from a short drag, then a flick closes it on a timed slide",
        caption:
          "Opens to its measured height, springs back from a short drag, and a flick closes it on a timed slide. Rebuilt in HTML from the component's own values.",
      },
      {
        type: "code",
        file: "components/ui/Sheet.tsx",
        lang: "ts",
        code: basebandSheet,
        caption:
          "Excerpt, trimmed with …. sheetOut is 240 ms, never under 120.",
      },
      {
        type: "text",
        heading: "One box that changes shape",
        body: "Top up and Dial were two hand-animated sheets that kept the network's answer to themselves, so closing one lost the request, and the two could start competing sessions on a modem that holds one. They now share one session. Close and keep it running really keeps it: reopen either sheet and the answer or the menu is where it stopped. The answer is one box that changes shape between waiting, a menu to reply to and the answer, never a new box at a new size.",
      },
      {
        type: "loop",
        src: "/work/baseband/morph-loop.mp4",
        poster: "/work/baseband/morph-loop.jpg",
        label:
          "The Dial box: waiting, a menu with a reply field, a reply sent, waiting again, then the answer",
        caption:
          "Waiting, a menu, a reply sent, then the answer: the box springs to each new size. Rebuilt in HTML from the design, on the app's own spring and fade.",
      },
      {
        type: "code",
        file: "lib/motion.ts",
        lang: "ts",
        code: basebandMotion,
        caption:
          "gentle is stiffness 385, damping 39. The text fades in over 200 ms, and both go instant under reduced motion.",
      },
      {
        type: "list",
        heading: "Under the hood",
        items: [
          {
            title: "A speed line drawn on the UI thread",
            body: "The live trace is drawn with Skia from shared values. The first version, in SVG, re-parsed a path string every frame and loaded the phone. It spans the latest unbroken minute of readings, so the line always fills the width.",
          },
          {
            title: "Speed that is actually measured",
            body: "A capture proved the router's realtime counter equals the change in its byte counter each second, so the live speed is a real rate, read once a second apart from the slower status poll.",
          },
          {
            title: "Native where the platform has it",
            body: "On iOS the tab bar, headers, long-press menus and confirmations are the system's own; Android keeps the drawn design. Both share the same copy.",
          },
        ],
      },
      {
        type: "text",
        heading: "Room to unfold",
        body: "A layout study for a foldable iPhone. Folded, the hub reflows wider and shorter. Unfolded, it splits into two equal halves so the fold falls between them, with your devices beside the hub. Same components and data, only reflowed.",
      },
      {
        type: "image",
        wide: true,
        image: {
          src: "/work/baseband/duo-unfolded.png",
          alt: "Baseband unfolded on a foldable iPhone: the hub on the left half, connected devices on the right",
          width: 2000,
          height: 1423,
        },
        caption:
          "Unfolded: the hub on one half, devices on the other. A study; the shipped app is unchanged.",
      },
      {
        type: "text",
        body: "It's free, supported by donations, and the address sheet that finds your router has its own four states on",
        link: { label: "Details", href: "/details" },
      },
    ],
  },
  {
    slug: "fillyr",
    name: "Fillyr",
    icon: "/icons/fillyr.png",
    line: "Turn any flyer into a fillable link.",
    facts: [
      { label: "Role", value: "Design and engineering, start to finish" },
      {
        label: "Built with",
        value: "Next.js, tRPC, Drizzle, Konva, Cloudflare R2",
      },
    ],
    links: [
      { label: "fillyr.app", href: "https://fillyr.app" },
      {
        label: "The story",
        href: "/writing/what-actually-happened-when-i-shipped-fillyr",
      },
    ],
    blocks: [
      {
        type: "image",
        wide: true,
        image: {
          src: "/work/fillyr/editor.png",
          alt: "The Fillyr editor with a youth convention flyer, a circular photo slot and a name field in gold",
          width: 2880,
          height: 1800,
        },
        caption:
          "The editor, with a photo slot and a name field mapped onto a church convention flyer.",
      },
      {
        type: "text",
        body: "Fillyr started with a ₦500 \"face of the week\" fee a friend and I didn't want to pay. I built a tool to fill a flyer template instead: two days of progress, then two days fighting Fabric.js, which kept placing images at the edge of the canvas, before I moved the editor to Konva. Then people started using it for church announcements, small business promos and events happening that weekend, so every detail since has served one idea: you shouldn't have to think.",
      },
      {
        type: "text",
        heading: "A colour straight off the flyer",
        body: "Text you add should look like it was always part of the design, so the colour picker samples the flyer itself. Where the browser has an eyedropper, Fillyr hands over to it. Everywhere else it draws the flyer at full resolution into a hidden canvas and reads the exact pixel under your click, mapped from the scaled preview.",
      },
      {
        type: "loop",
        src: "/work/fillyr/sample-v2.mp4",
        poster: "/work/fillyr/sample-v2.jpg",
        label:
          "The Fillyr editor: sampling gold from the flyer's ring for the name, then centring and bolding it",
        caption:
          "Sampling the ring's gold for the name, then centring it. Recorded in the real editor.",
      },
      {
        type: "text",
        heading: "Text that fits the box it's given",
        body: "Names are never the length you designed for. With auto-fit on, a field finds the largest size its text fits at, by binary search between the field's minimum and maximum. Multiline text wraps first and only shrinks once wrapping no longer fits. The same measuring code runs in the editor, on the fill page and in the exported PNG, so what you see while typing is what downloads. The photo you add never leaves your browser.",
      },
      {
        type: "loop",
        src: "/work/fillyr/fit-v2.mp4",
        poster: "/work/fillyr/fit-v2.jpg",
        label:
          "The public fill page: typing a short name, then a long one that shrinks to fit the bar",
        caption: "A short name, then a long one, on the public fill page.",
      },
      {
        type: "code",
        file: "lib/text-fit.ts",
        lang: "ts",
        code: fillyrFit,
        caption: "Excerpt, trimmed with …",
      },
      {
        type: "text",
        heading: "Placed in the flyer's own pixels",
        body: "Fields are stored in the flyer's own pixels, not the screen's: the name sits at x 161, y 971 on a 1080 × 1350 design, whatever size the editor happens to be drawn at. Each field remembers the size it was placed against and is projected onto whatever renders it, with its font sizes scaled too. A field dragged partly off the edge clips exactly as it will on the fill page, and one left entirely off is pulled back so it never becomes unreachable. Rotation snaps every 45° within 5°, around the box's centre.",
      },
      {
        type: "code",
        file: "lib/field-geometry.ts",
        lang: "ts",
        code: fillyrProject,
        caption: "Excerpt, trimmed with …",
      },
      {
        type: "text",
        heading: "Fifty cards from one CSV",
        body: "For a class register or fifty vendors, Bulk Fill writes a CSV template whose columns are your field labels, renders one card per row with the same renderer as a single download, and zips them. A row whose photo link won't load fails loudly instead of shipping a card with an empty circle, and the progress also shows in the editor's top bar.",
      },
      {
        type: "loop",
        src: "/work/fillyr/bulk-v3.mp4",
        poster: "/work/fillyr/bulk-v3.jpg",
        label:
          "Bulk Fill: a CSV of six names becomes six previewed cards, then one ZIP",
        caption: "Six names in, six cards previewed, one ZIP out.",
      },
      {
        type: "text",
        body: "It's free while it finds its shape.",
        link: { label: "Make a flyer", href: "https://fillyr.app" },
      },
    ],
  },
  {
    slug: "waysdrop",
    name: "Waysdrop",
    icon: "/icons/waysdrop.png",
    line: "On-demand delivery, connecting people, stores and couriers.",
    facts: [
      { label: "Role", value: "Frontend developer" },
      { label: "When", value: "Dec 2025 – Mar 2026" },
      {
        label: "Built with",
        value: "Next.js, TanStack Query and Table, Google Maps, Socket.IO",
      },
    ],
    links: [{ label: "waysdrop.com", href: "https://waysdrop.com" }],
    blocks: [
      {
        type: "text",
        body: "Waysdrop connects people, stores and couriers for on-demand delivery. I built its web side across eight repos: the customer app, the admin, agent and support dashboards, and the chat widget they share. The internal tools grew to dozens of screens, so the work that mattered most was the small set of components and hooks every screen is made from.",
      },
      {
        type: "text",
        heading: "Every list is the same two components",
        body: "Almost every admin screen is a Stats block over a TableList. A page passes an endpoint and its columns; the table brings search, filters, pagination kept in the URL, columns you can hide and that stay hidden, and an export button that appears whenever the API offers one. The admin alone has 49 list pages and 33 stats blocks built this way, and the agent and global admin dashboards reuse the same pieces.",
      },
      {
        type: "text",
        body: "Every write goes through one mutation hook and then invalidates the queries it touched, so a POST, PUT or DELETE shows up on screen the moment the server confirms it, with no reload and no stale row. Route parameters ride in the same typed object as the body: keys starting with an underscore build the URL and are stripped before the request is sent.",
      },
      {
        type: "loop",
        src: "/work/waysdrop/promo-toggle-v2.mp4",
        poster: "/work/waysdrop/promo-toggle-v2.jpg",
        label:
          "Disabling a promo code: the menu, a confirmation, then the row's status changes to Disabled without a reload, and back",
        caption:
          "Disable, confirm, and the row updates in place. Run locally against a mock API.",
      },
      {
        type: "code",
        file: "lib/hooks/use-api.ts",
        lang: "ts",
        code: waysdropMutation,
        caption: "The whole hook, from the support dashboard.",
      },
      {
        type: "text",
        heading: "Couriers on a live map",
        body: "The admin's map follows every courier live. Positions arrive as batches over Server-Sent Events, and each batch is diffed against what's on the map: new couriers get a marker, moved ones have their existing marker repositioned, and ones that went offline are removed. Nothing is redrawn between batches, and nearby markers cluster into counts until you zoom in.",
      },
      {
        type: "loop",
        src: "/work/waysdrop/map-live.mp4",
        poster: "/work/waysdrop/map-live.jpg",
        label:
          "The admin tracking map: couriers across Lagos moving and clustering as live batches arrive",
        caption:
          "Couriers moving across Lagos as batches arrive. The stream here is simulated; the map is the real component.",
      },
      {
        type: "code",
        file: "components/custom/map/GoogleMaps.tsx",
        lang: "ts",
        code: waysdropMarkers,
        caption: "Excerpt, trimmed with …",
      },
      {
        type: "text",
        heading: "A chat widget that survives a bad connection",
        body: "Support chat ships as its own package, @waysdrop/chat, so the customer app and anything else can drop it in with one component. It went through fourteen versions in two months as the support team used it. The last one changed how it treats a bad connection: it now retries forever with backoff capped at five seconds instead of giving up after ten tries, the composer never locks while it's offline so you can keep typing, and typing indicators are only sent while connected, so agents never see a stale one.",
      },
      {
        type: "loop",
        width: 380,
        src: "/work/waysdrop/chat.mp4",
        poster: "/work/waysdrop/chat.jpg",
        label:
          "The chat widget: a question answered, the connection drops to Connecting, the visitor keeps typing, and it comes back Online",
        caption:
          "A question answered, then the connection drops and comes back while you keep typing. The widget is the published package; the server is a local mock.",
      },
      {
        type: "code",
        file: "src/lib/socket.ts",
        lang: "ts",
        code: waysdropSocket,
        caption: "Excerpt, trimmed with …",
      },
    ],
  },
];
