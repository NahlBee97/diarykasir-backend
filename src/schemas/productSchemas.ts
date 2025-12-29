import { z } from "zod";

const toNumber = (val: unknown) => {
	if (typeof val === "string" && val.trim() !== "") return Number(val);
	return val;
};

export const createProductSchema = z.object({
	body: z.object({
		name: z.string().min(1, "Name is required"),
		category: z.string().min(1, "Category is required"),
		price: z.preprocess(toNumber, z.number().positive("Price must be positive")),
		stock: z.preprocess(
			toNumber,
			z.number().int("Stock must be an integer").min(0, "Stock cannot be negative")
		),
		image: z.string().nullable().optional(),
	}),
});

export const updateProductSchema = z.object({
	params: z.object({
		id: z
			.string()
			.regex(/^\d+$/, "Product ID must be a positive integer")
			.transform((val) => parseInt(val, 10)),
	}),
	body: z
		.object({
			name: z.string().min(1, "Name is required").optional(),
			category: z.string().min(1, "Category is required").optional(),
			price: z.preprocess(toNumber, z.number().positive("Price must be positive")).optional(),
			stock: z
				.preprocess(toNumber, z.number().int("Stock must be an integer").min(0, "Stock cannot be negative"))
				.optional(),
			image: z.string().nullable().optional(),
		})
		.partial(),
});

export const getProductsSchema = z.object({
	query: z.object({
		page: z
			.string()
			.regex(/^\d+$/, "Page must be a positive integer")
			.transform((val) => parseInt(val, 10))
			.optional(),
	}),
});

export const getTopProductsSchema = z.object({
	query: z.object({
		start: z.string(),
		end: z.string(),
		userId: z
			.string()
			.regex(/^\d+$/, "User ID must be a positive integer")
			.transform((val) => parseInt(val, 10))
			.optional(),
	}),
});

export const findProductByIdSchema = z.object({
	params: z.object({
		id: z
			.string()
			.regex(/^\d+$/, "Product ID must be a positive integer")
			.transform((val) => parseInt(val, 10)),
	}),
});

export const deleteProductSchema = z.object({
	params: z.object({
		id: z
			.string()
			.regex(/^\d+$/, "Product ID must be a positive integer")
			.transform((val) => parseInt(val, 10)),
	}),
});