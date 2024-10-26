import { Quran, TLocale } from "@0x1eef/quran";
import { Select } from "~/components/Select";

type Props = {
  locale: TLocale;
  setLocale: (v: TLocale) => void;
};

export function LanguageSelect({ locale, setLocale }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const locales = useMemo(() => Object.values(Quran.locales), [Quran.locales]);
  const refs = useMemo(() => locales.map(() => createRef()), [locales]);

  if (!locale) {
    return null;
  }

  function findAnchor(e: KeyboardEvent) {
    if (e.target instanceof HTMLAnchorElement) {
      const { target } = e;
      const index = Number(target.getAttribute("data-index"));
      return refs[index]?.current;
    } else {
      return null;
    }
  }

  useEffect(() => {
    function onKeyPress(e: KeyboardEvent) {
      if (e.key === "SoftLeft") {
        const anchor = findAnchor(e);
        if (anchor) {
          setIsOpen(!isOpen);
          anchor.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyPress);
    return () => document.removeEventListener("keydown", onKeyPress);
  }, [isOpen]);

  return (
    <Select
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      value={locale.name}
      className="language-select w-20"
    >
      {locales.map((l: TLocale, i: number) => {
        return (
          <Select.Option
            data-index={i}
            ref={refs[i]}
            key={i}
            className={classNames(
              "flex h-4 text-sm w-full items-center justify-center no-underline rounded pb-1 pt-1 mb-1 border-accent",
              l.direction,
              l.name === locale.name ? "active font-bold" : undefined,
            )}
            value={l.name}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              setLocale(l);
            }}
          >
            {l.displayName}
          </Select.Option>
        );
      })}
    </Select>
  );
}
