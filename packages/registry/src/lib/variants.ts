import { StyleSheet } from "react-native";

export type VariantMap = Record<string, Record<string, any>>;

export type VariantProps<V extends VariantMap> = {
  [K in keyof V]?: keyof V[K];
};

export type VariantConfig<V extends VariantMap> = {
  base?: any;
  variants?: V;
  defaultVariants?: VariantProps<V>;
};

export function createVariants<V extends VariantMap>(config: VariantConfig<V>) {
  const { base, variants = {} as V, defaultVariants = {} } = config;

  return function resolve(props: VariantProps<V> & { style?: any } = {}): any {
    const chosen: Record<string, unknown> = { ...defaultVariants, ...props };
    const styles: any[] = [];
    if (base) styles.push(base);
    for (const key of Object.keys(variants)) {
      const value = chosen[key];
      if (value != null && variants[key] && variants[key][value as string]) {
        styles.push(variants[key][value as string]);
      }
    }
    if (props.style) styles.push(props.style);
    return styles.length === 1 ? styles[0] : styles;
  };
}

export const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");