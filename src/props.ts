import { ProxyObject, Variant } from "dbus-next";

export async function getProperty(proxyObject: ProxyObject, iface: string, property: string): Promise<Variant<any> | undefined>{
	const props = proxyObject.getInterface("org.freedesktop.DBus.Properties");
	let result: Variant<any> | undefined;
	try{
		result = await props.Get(iface, property);
	}catch(_){
		result = undefined;
	}
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