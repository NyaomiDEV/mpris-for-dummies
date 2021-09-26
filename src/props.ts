import { ProxyObject, Variant } from "dbus-next";

export async function getProperty(proxyObject: ProxyObject, iface: string, property: string): Promise<Variant<any>>{
	const props = proxyObject.getInterface("org.freedesktop.DBus.Properties");
	const result: Variant<any> = await props.Get(iface, property);
	return result;
}

export async function setProperty(proxyObject: ProxyObject, iface: string, property: string, signature: string, value: any): Promise<void>{
	const props = proxyObject.getInterface("org.freedesktop.DBus.Properties");
	const variant = new Variant();
	variant.signature = signature;
	variant.value = value;

	return await props.Set(
		iface,
		property,
		variant
	);
}