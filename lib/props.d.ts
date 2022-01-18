import { ProxyObject, Variant } from "dbus-next";
export declare function getProperty(proxyObject: ProxyObject, iface: string, property: string): Promise<Variant<any> | undefined>;
export declare function getAllProperties(proxyObject: ProxyObject, iface: string): Promise<Variant<any>[] | undefined>;
export declare function setProperty(proxyObject: ProxyObject, iface: string, property: string, signature: string, value: any): Promise<void>;
//# sourceMappingURL=props.d.ts.map