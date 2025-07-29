import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  ArrowLeft,
  Check,
  Minus,
  ShoppingCart,
  RefreshCw,
  Share2,
  Download,
  Upload,
  X,
  Copy,
  ChevronUp,
  ChevronDown,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent, // Explicitly used now
  CardDescription,
  CardHeader, // Explicitly used now
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Interfaces for data types
interface Product {
  id: string;
  name: string;
  quantity: number;
  isCompleted: boolean;
  isOutOfStock: boolean;
  imageUrl?: string;
  comment?: string;
  category?: string;
  completedAt?: Date;
}

interface RestockList {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  products: Product[];
}

// --- Reusable Components ---

interface ProductCardProps {
  product: Product;
  updateProductQuantity: (id: string, change: number) => void;
  toggleProductCompletion: (id: string) => void;
  toggleOutOfStock: (id: string) => void;
  resetProductQuantity: (id: string) => void;
  openEditModal: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  updateProductQuantity,
  toggleProductCompletion,
  toggleOutOfStock,
  resetProductQuantity,
  openEditModal,
}) => (
  <div
    className={`border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
      product.isOutOfStock ? "bg-red-50" : "bg-white"
    }`}
    onClick={() => openEditModal(product)}
  >
    <div className="p-4 pb-2">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            toggleOutOfStock(product.id);
          }}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title={
            product.isOutOfStock
              ? "Mark as in stock"
              : "Mark as out of stock"
          }
        >
          <ShoppingCart
            className={`w-4 h-4 ${product.isOutOfStock ? "text-red-500" : "text-gray-400"}`}
          />
        </button>
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            resetProductQuantity(product.id);
          }}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
      {product.category && (
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
      )}
    </div>
    <div className="mx-4 mb-4">
      <div className="bg-white rounded-lg h-32 flex items-center justify-center overflow-hidden border border-gray-200">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
        )}
      </div>
    </div>
    <div className="px-4 pb-4">
      <div className="flex items-center justify-center mb-3 gap-2">
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            updateProductQuantity(product.id, -1);
          }}
          className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors touch-manipulation"
        >
          <Minus className="w-5 h-5 text-gray-600" />
        </button>
        <span className="px-4 text-lg font-medium text-gray-900 min-w-[3rem] text-center">
          {product.quantity}
        </span>
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            updateProductQuantity(product.id, 1);
          }}
          className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors touch-manipulation"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          toggleProductCompletion(product.id);
        }}
        className={`w-full rounded-lg py-2 transition-colors border ${
          product.isCompleted
            ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        {product.isCompleted ? (
          <Check className="w-4 h-4 mr-2" />
        ) : null}
        {product.isCompleted ? "Completed" : "Mark as Completed"}
      </button>
    </div>
  </div>
);

interface ShareImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  buttonLabel: string;
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAction: () => void;
  isActionDisabled: boolean;
  error: string;
  isTextarea?: boolean;
  copyButton?: JSX.Element;
  children?: React.ReactNode;
}

const ShareImportModal: React.FC<ShareImportModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  buttonLabel,
  inputValue,
  onInputChange,
  onAction,
  isActionDisabled,
  error,
  isTextarea,
  copyButton,
  children,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {isTextarea ? (
          <Textarea
            value={inputValue}
            onChange={onInputChange}
            placeholder="Paste CSV content here..."
            className="min-h-[150px]"
          />
        ) : (
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={onInputChange}
              placeholder="Paste code here..."
              readOnly={copyButton !== undefined}
            />
            {copyButton}
          </div>
        )}
        {children}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onAction} disabled={isActionDisabled}>
          {buttonLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// --- Main App Component ---
export default function GuluInventoryApp() {
  const [lists, setLists] = useState<RestockList[]>(() => {
    const saved = localStorage.getItem("gulu-lists");
    return saved
      ? JSON.parse(saved).map((l: any) => ({
          ...l,
          createdAt: new Date(l.createdAt),
          products: l.products.map((p: any) => ({
            ...p,
            completedAt: p.completedAt
              ? new Date(p.completedAt)
              : undefined,
          })),
        }))
      : [
          {
            id: "1",
            name: "Sparkling Water",
            description: "Imported from Shopify on 10/26/23",
            createdAt: new Date("2025-07-24"),
            products: [
              {
                id: "1",
                name: "Blackberry Tange...",
                quantity: 0,
                isCompleted: false,
                isOutOfStock: false,
                category: "Beverages",
                imageUrl:
                  "https://images.unsplash.com/photo-1581635439309-ab4edce0c040?w=300&h=300&fit=crop",
              },
              {
                id: "2",
                name: "Blueberry Nectar...",
                quantity: 0,
                isCompleted: false,
                isOutOfStock: false,
                category: "Beverages",
                imageUrl:
                  "https://images.unsplash.com/photo-1560458675-fc20e3b8a1e2?w=300&h=300&fit=crop",
              },
              {
                id: "3",
                name: "Cherry Lime",
                quantity: 0,
                isCompleted: false,
                isOutOfStock: false,
                category: "Beverages",
                imageUrl:
                  "https://images.unsplash.com/photo-1560458675-fc20e3b8a1e2?w=300&h=300&fit=crop",
              },
              {
                id: "4",
                name: "Pomegranate",
                quantity: 0,
                isCompleted: false,
                isOutOfStock: false,
                category: "Beverages",
                imageUrl:
                  "https://images.unsplash.com/photo-1560458675-fc20e3b8a1e2?w=300&h=300&fit=crop",
              },
            ],
          },
          {
            id: "2",
            name: "Organic Snacks",
            description: "Manual Entry",
            createdAt: new Date("2025-07-23"),
            products: Array.from({ length: 15 }, (_, i) => ({
              id: `2-${i}`,
              name: `Product ${i + 1}`,
              quantity: 0,
              isCompleted: i < 8,
              isOutOfStock: false,
              category: i < 5 ? "Snacks" : i < 10 ? "Organic" : "Health Food",
            })),
          },
          {
            id: "3",
            name: "Cleaning Supplies",
            description: "Imported from Code",
            createdAt: new Date("2025-07-22"),
            products: Array.from({ length: 31 }, (_, i) => ({
              id: `3-${i}`,
              name: `Product ${i + 1}`,
              quantity: 0,
              isCompleted: i < 31,
              isOutOfStock: false,
              category: i < 10 ? "Cleaning" : i < 20 ? "Household" : "Maintenance",
            })),
          },
          {
            id: "4",
            name: "Dairy Products",
            description: "Manual Entry",
            createdAt: new Date("2025-07-21"),
            products: Array.from({ length: 8 }, (_, i) => ({
              id: `4-${i}`,
              name: `Product ${i + 1}`,
              quantity: 0,
              isCompleted: i < 2,
              isOutOfStock: false,
              category: i < 4 ? "Dairy" : "Refrigerated",
            })),
          },
        ];
  });

  const [selectedListId, setSelectedListId] =
    useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProductName, setSearchProductName] =
    useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "quantity">(
    "date",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    "desc",
  );
  const [productSortBy, setProductSortBy] = useState<
    "name" | "quantity" | "completion" | "stock" | "category"
  >("name");
  const [productSortOrder, setProductSortOrder] = useState<
    "asc" | "desc"
  >("asc");
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCsvImportModal, setShowCsvImportModal] =
    useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] =
    useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);
  const [shareCode, setShareCode] = useState("");
  const [importCode, setImportCode] = useState("");
  const [csvContent, setCsvContent] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importError, setImportError] = useState("");
  const [copied, setCopied] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] =
    useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [newProductComment, setNewProductComment] =
    useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    imageUrl: "",
    comment: "",
    category: "",
  });

  // PWA states
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    localStorage.setItem("gulu-lists", JSON.stringify(lists));
  }, [lists]);

  // PWA initialization
  useEffect(() => {
    const handleOnline = () => {
      setShowOfflineNotice(false);
    };
    const handleOffline = () => {
      setShowOfflineNotice(true);
      setTimeout(() => setShowOfflineNotice(false), 3000);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setShowInstallPrompt(true);
      };
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, []);

  const selectedList =
    lists.find((list) => list.id === selectedListId) || null;

  const availableCategories = useMemo(() => {
    if (!selectedList) return [];
    const categories = selectedList.products
      .map((p) => p.category)
      .filter((cat): cat is string => !!cat)
      .filter((cat, index, arr) => arr.indexOf(cat) === index)
      .sort();
    return categories;
  }, [selectedList]);

  const filteredLists = useMemo(() => {
    return lists
      .filter(
        (list) =>
          list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          list.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => {
        const aCompletedCount = a.products.filter(
          (p) => p.isCompleted,
        ).length;
        const aIsFullyCompleted =
          a.products.length > 0 &&
          aCompletedCount === a.products.length;
        const bCompletedCount = b.products.filter(
          (p) => p.isCompleted,
        ).length;
        const bIsFullyCompleted =
          b.products.length > 0 &&
          bCompletedCount === b.products.length;
        if (aIsFullyCompleted !== bIsFullyCompleted) {
          return aIsFullyCompleted ? 1 : -1;
        }
        if (sortBy === "name") {
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortBy === "quantity") {
          return sortOrder === "asc"
            ? a.products.length - b.products.length
            : b.products.length - a.products.length;
        } else {
          return sortOrder === "asc"
            ? a.createdAt.getTime() - b.createdAt.getTime()
            : b.createdAt.getTime() - a.createdAt.getTime();
        }
      });
  }, [lists, searchQuery, sortBy, sortOrder]);

  const generateShareCode = (list: RestockList) => {
    const shareData = {
      n: list.name,
      d: list.description,
      p: list.products.map((p) => ({
        n: p.name,
        q: p.quantity,
        c: p.comment || "",
        i: p.imageUrl || "",
        cat: p.category || "",
      })),
    };
    const encoded = btoa(JSON.stringify(shareData));
    return encoded;
  };

  const decodeShareCode = (
    code: string,
  ): RestockList | null => {
    try {
      const decoded = JSON.parse(atob(code));
      return {
        id: Date.now().toString(),
        name: decoded.n || "Imported List",
        description: decoded.d || "",
        createdAt: new Date(),
        products: (decoded.p || []).map(
          (p: any, index: number) => ({
            id: `${Date.now()}-${index}`,
            name: p.n || "Unnamed Product",
            quantity: p.q || 0,
            isCompleted: false,
            isOutOfStock: false,
            imageUrl: p.i || "",
            comment: p.c || "",
            category: p.cat || "",
          }),
        ),
      };
    } catch (error) {
      return null;
    }
  };

  const parseCSV = (content: string): RestockList | null => {
    try {
      const lines = content
        .trim()
        .split("\n")
        .filter((line) => line.trim());
      if (lines.length === 0) {
        throw new Error("CSV content is empty");
      }
      const listName =
        lines[0].split(",")[0].trim() || "Imported List";
      const products: Product[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i]
          .split(",")
          .map((part) => part.trim());
        const productName =
          parts[0] || `Product ${products.length + 1}`;
        const category = parts[1] || "";
        const imageUrl = parts[2] || "";
        const comment = parts[3] || "";
        products.push({
          id: `${Date.now()}-${products.length}`,
          name: productName,
          quantity: 0,
          isCompleted: false,
          isOutOfStock: false,
          imageUrl: imageUrl || undefined,
          comment: comment || undefined,
          category: category || undefined,
        });
      }
      return {
        id: Date.now().toString(),
        name: listName,
        description: `Imported from CSV on ${new Date().toLocaleDateString()}`,
        createdAt: new Date(),
        products,
      };
    } catch (error) {
      setImportError(
        error instanceof Error
          ? error.message
          : "Invalid CSV format",
      );
      return null;
    }
  };

  const handleCsvFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setImportError("Please select a CSV file");
      return;
    }
    
    setImportError(""); // Clear any previous errors
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvContent(content);
      setCsvFile(file);
    };
    reader.onerror = () => {
      setImportError("Error reading file. Please try again.");
    };
    reader.readAsText(file);
  };

  const importCsv = () => {
    if (!csvFile) {
      setImportError("Please select a CSV file");
      return;
    }
    if (!csvContent.trim()) {
      setImportError("Unable to read file content. Please try again.");
      return;
    }
    const importedList = parseCSV(csvContent);
    if (importedList) {
      setLists([...lists, importedList]);
      setShowCsvImportModal(false);
      setCsvContent("");
      setCsvFile(null);
      setImportError("");
      setSelectedListId(importedList.id);
    }
  };

  const createNewList = () => {
    if (newListName.trim()) {
      const newList: RestockList = {
        id: Date.now().toString(),
        name: newListName,
        description: newListDescription,
        createdAt: new Date(),
        products: [],
      };
      setLists([...lists, newList]);
      setNewListName("");
      setNewListDescription("");
      setShowNewListForm(false);
    }
  };

  const shareList = (list: RestockList) => {
    const code = generateShareCode(list);
    setShareCode(code);
    setShowShareModal(true);
  };

  const importList = () => {
    if (!importCode.trim()) {
      setImportError("Please enter a share code");
      return;
    }
    const importedList = decodeShareCode(importCode.trim());
    if (importedList) {
      setLists([...lists, importedList]);
      setShowImportModal(false);
      setImportCode("");
      setImportError("");
      setSelectedListId(importedList.id);
    } else {
      setImportError(
        "Invalid share code. Please check the code and try again.",
      );
    }
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const deleteList = (listId: string) =>
    setLists(lists.filter((list) => list.id !== listId));

  const updateProduct = (
    productId: string,
    updates: Partial<Product>,
  ) => {
    if (!selectedList) return;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.map((p) =>
        p.id === productId ? { ...p, ...updates } : p,
      ),
    };
    setLists(
      lists.map((list) =>
        list.id === selectedList.id ? updatedList : list,
      ),
    );
  };

  const resetAllProducts = () => {
    if (!selectedList) return;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.map((p) => ({
        ...p,
        quantity: 0,
        isCompleted: false,
        completedAt: undefined,
      })),
    };
    setLists(
      lists.map((list) =>
        list.id === selectedList.id ? updatedList : list,
      ),
    );
  };

  const resetProductQuantity = (productId: string) => {
    if (!selectedList) return;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.map((p) =>
        p.id === productId ? { ...p, quantity: 0 } : p,
      ),
    };
    setLists(
      lists.map((list) =>
        list.id === selectedList.id ? updatedList : list,
      ),
    );
  };

  const updateProductQuantity = (
    productId: string,
    change: number,
  ) => {
    if (!selectedList) return;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.map((p) =>
        p.id === productId
          ? { ...p, quantity: Math.max(0, p.quantity + change) }
          : p,
      ),
    };
    setLists(
      lists.map((list) =>
        list.id === selectedList.id ? updatedList : list,
      ),
    );
  };

  const toggleProductCompletion = (productId: string) => {
    if (!selectedList) return;

    const product = selectedList.products.find(
      (p) => p.id === productId,
    );
    if (!product) return;

    const isNowCompleted = !product.isCompleted;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.map((p) =>
        p.id === productId
          ? {
              ...p,
              isCompleted: isNowCompleted,
              completedAt: isNowCompleted
                ? new Date()
                : undefined,
            }
          : p,
      ),
    };
    setLists(
      lists.map((list) =>
        list.id === selectedList.id ? updatedList : list,
      ),
    );
  };

  const toggleOutOfStock = (productId: string) => {
    if (!selectedList) return;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.map((p) =>
        p.id === productId
          ? { ...p, isOutOfStock: !p.isOutOfStock }
          : p,
      ),
    };
    setLists(
      lists.map((list) =>
        list.id === selectedList.id ? updatedList : list,
      ),
    );
  };

  const addProduct = () => {
    if (!selectedList || !newProductName.trim()) return;
    const newProduct: Product = {
      id: Date.now().toString(),
      name: newProductName,
      quantity: 0,
      isCompleted: false,
      isOutOfStock: false,
      imageUrl: newProductImage || undefined,
      comment: newProductComment || undefined,
      category: newProductCategory || undefined,
    };
    const updatedList = {
      ...selectedList,
      products: [...selectedList.products, newProduct],
    };
    setLists(
      lists.map((list) =>
        list.id === selectedList.id ? updatedList : list,
      ),
    );
    setNewProductName("");
    setNewProductImage("");
    setNewProductComment("");
    setNewProductCategory("");
    setShowAddProductModal(false);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      imageUrl: product.imageUrl || "",
      comment: product.comment || "",
      category: product.category || "",
    });
    setShowEditModal(true);
  };

  const saveProductEdit = () => {
    if (
      !editingProduct ||
      !selectedList ||
      !editForm.name.trim()
    )
      return;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: editForm.name,
              imageUrl: editForm.imageUrl || undefined,
              comment: editForm.comment || undefined,
              category: editForm.category || undefined,
            }
          : p,
      ),
    };
    setLists(
      lists.map((list) =>
        list.id === selectedList.id ? updatedList : list,
      ),
    );
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const deleteProductFromEdit = () => {
    if (!editingProduct || !selectedList) return;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.filter(
        (p) => p.id !== editingProduct.id,
      ),
    };
    setLists(
      lists.map((list) =>
        list.id === selectedList.id ? updatedList : list,
      ),
    );
    setShowEditModal(false);
    setEditingProduct(null);
  };

  if (selectedList) {
    const filteredProducts = selectedList.products
      .filter((p) => {
        const matchesSearch = p.name
          .toLowerCase()
          .includes(searchProductName.toLowerCase());
        const matchesCategory = !categoryFilter || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        // First, always sort out-of-stock items to the bottom
        if (a.isOutOfStock !== b.isOutOfStock) {
          return a.isOutOfStock ? 1 : -1;
        }

        // Second, within in-stock items, always sort completed items to the bottom
        // (unless specifically sorting by completion status)
        if (
          productSortBy !== "completion" &&
          a.isCompleted !== b.isCompleted
        ) {
          return a.isCompleted ? 1 : -1;
        }

        // Handle different sort options for items with same stock and completion status
        let comparison = 0;

        switch (productSortBy) {
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "quantity":
            comparison = a.quantity - b.quantity;
            break;
          case "completion":
            // For completion sort, allow user to control the order
            comparison =
              a.isCompleted === b.isCompleted
                ? 0
                : a.isCompleted
                  ? 1
                  : -1;
            break;
          case "stock":
            // Since we already handled stock status above, sort by name as secondary
            comparison = a.name.localeCompare(b.name);
            break;
          case "category":
            comparison = (a.category || "").localeCompare(b.category || "");
            break;
          default:
            comparison = a.name.localeCompare(b.name);
        }

        // Apply sort order
        if (productSortOrder === "desc") {
          comparison = -comparison;
        }

        // Secondary sort by name if primary sort values are equal (except for name sort)
        if (comparison === 0 && productSortBy !== "name") {
          comparison = a.name.localeCompare(b.name);
        }

        return comparison;
      });

    const completedCount = selectedList.products.filter(
      (p) => p.isCompleted,
    ).length;
    const totalCount = selectedList.products.length;

    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedListId(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Lists</span>
            </Button>
            <Button
              onClick={resetAllProducts}
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset All
            </Button>
          </div>

          {/* Title Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              {selectedList.name}
            </h1>
            <p className="text-gray-600 mb-2">
              {selectedList.description}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-gray-500">
                {completedCount} of {totalCount} items completed
              </p>
              <Button
                onClick={() => setShowAddProductModal(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-6 py-2 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchProductName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchProductName(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            {availableCategories.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="px-3 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {categoryFilter && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCategoryFilter("")}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Clear filter"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Sort Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Sort</span>
                  <Select
                    value={productSortBy}
                    onValueChange={(value: "name" | "quantity" | "completion" | "stock" | "category") =>
                      setProductSortBy(value)
                    }
                  >
                    <SelectTrigger className="border-none shadow-none p-0 bg-transparent focus:outline-none">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="quantity">Quantity</SelectItem>
                      <SelectItem value="completion">Completion</SelectItem>
                      <SelectItem value="stock">Stock Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() =>
                    setProductSortOrder(
                      productSortOrder === "asc"
                        ? "desc"
                        : "asc",
                    )
                  }
                  variant="ghost"
                  size="icon"
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title={`Sort ${productSortOrder === "asc" ? "descending" : "ascending"}`}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""}
                {categoryFilter && ` in ${categoryFilter}`}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                updateProductQuantity={updateProductQuantity}
                toggleProductCompletion={toggleProductCompletion}
                toggleOutOfStock={toggleOutOfStock}
                resetProductQuantity={resetProductQuantity}
                openEditModal={openEditModal}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No products found.
              </p>
            </div>
          )}
        </div>

        {/* Add Product Modal (using Dialog component) */}
        <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to the list. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newProductName" className="text-right">Name</Label>
                <Input
                  id="newProductName"
                  value={newProductName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProductName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newProductCategory" className="text-right">Category</Label>
                <Input
                  id="newProductCategory"
                  value={newProductCategory}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProductCategory(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newProductImage" className="text-right">Image URL</Label>
                <Input
                  id="newProductImage"
                  value={newProductImage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProductImage(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newProductComment" className="text-right">Comment</Label>
                <Textarea
                  id="newProductComment"
                  value={newProductComment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProductComment(e.target.value)}
                  className="col-span-3 min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddProductModal(false)}>
                Cancel
              </Button>
              <Button onClick={addProduct} disabled={!newProductName.trim()}>
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Product Modal (using Dialog component) */}
        {editingProduct && (
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>
                  Make changes to your product here. Click save when
                  you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category</Label>
                  <Input
                    id="category"
                    value={editForm.category}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={editForm.imageUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditForm({ ...editForm, imageUrl: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="comment" className="text-right">Comment</Label>
                  <Textarea
                    id="comment"
                    value={editForm.comment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setEditForm({ ...editForm, comment: e.target.value })
                    }
                    className="col-span-3 min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row sm:justify-between">
                <Button variant="destructive" onClick={deleteProductFromEdit} className="w-full sm:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Product
                </Button>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button variant="outline" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveProductEdit}>Save changes</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Offline Notice */}
      {showOfflineNotice && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
          You're offline. Changes will sync when you're back online.
        </div>
      )}

      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm mx-auto">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">C</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Install Gulu Inventory</h3>
                <p className="text-xs text-gray-500">Add to your home screen for quick access</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInstallPrompt(false)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setShowInstallPrompt(false)}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1"
            >
              <Download className="w-4 h-4" />
              Install
            </Button>
            <Button
              onClick={() => setShowInstallPrompt(false)}
              variant="outline"
              className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Not now
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                C
              </span>
            </div>
          </div>
          <Button
            onClick={() => setShowNewListForm(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-full transition-colors"
          >
            New List
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Import and Sort Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowImportModal(true)}
              variant="outline"
              className="flex items-center gap-2 border border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors"
            >
              <Download className="w-4 h-4" />
              Import from Code
            </Button>
            <Button
              onClick={() => setShowCsvImportModal(true)}
              variant="outline"
              className="flex items-center gap-2 border border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import from CSV
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Sort</span>
              <Select
                value={sortBy}
                onValueChange={(value: "name" | "date" | "quantity") => setSortBy(value)}
              >
                <SelectTrigger className="border-none shadow-none p-0 bg-transparent focus:outline-none">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="quantity">Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() =>
                setSortOrder(
                  sortOrder === "asc" ? "desc" : "asc",
                )
              }
              variant="ghost"
              size="icon"
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search lists..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lists */}
        <div className="space-y-4">
          {filteredLists.map((list) => {
            const completedCount = list.products.filter(
              (p) => p.isCompleted,
            ).length;
            const totalCount = list.products.length;
            const progressPercentage =
              totalCount > 0
                ? (completedCount / totalCount) * 100
                : 0;

            return (
              <Card
                key={list.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer relative"
                onClick={() => setSelectedListId(list.id)}
              >
                {/* Action buttons in top right */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <Button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      shareList(list);
                    }}
                    variant="ghost"
                    size="icon"
                    className="p-2 text-gray-400 hover:text-teal-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Share list"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      deleteList(list.id);
                    }}
                    variant="ghost"
                    size="icon"
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Delete list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Content wrapped in CardHeader and CardContent */}
                <CardHeader className="pr-20"> {/* Removed flex properties here as CardHeader handles its own layout */}
                  <CardTitle className="text-xl text-gray-900 mb-1">
                    {list.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 mb-2">
                    {list.description}
                  </CardDescription>
                  <p className="text-sm text-gray-500">
                    {list.products.filter(p => !p.isOutOfStock).length} out of {totalCount} in stock
                  </p>
                </CardHeader>
                <CardContent className="text-right">
                  <p className="text-sm text-gray-500">
                    {list.createdAt.toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>
                </CardContent>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </Card>
            );
          })}
        </div>

        {filteredLists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No lists found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* New List Form Dialog (using Dialog component) */}
      <Dialog open={showNewListForm} onOpenChange={setShowNewListForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
            <DialogDescription>Enter the details for your new restock list.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="block text-sm font-medium mb-1" htmlFor="name">List Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Enter list name..."
                value={newListName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewListName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1" htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter description..."
                value={newListDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewListDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewListForm(false)}>
              Cancel
            </Button>
            <Button onClick={createNewList} disabled={!newListName.trim()}>
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Modal (using Dialog component) */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import List</DialogTitle>
            <DialogDescription>
              Paste a share code to import a list shared by someone else.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="text"
              value={importCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setImportCode(e.target.value);
                setImportError(""); // Clear error when user types
              }}
              placeholder="Paste share code here..."
            />
            {importError && (
              <p className="text-red-500 text-sm">
                {importError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowImportModal(false); setImportCode(""); setImportError(""); }}>
              Cancel
            </Button>
            <Button
              onClick={importList}
              disabled={!importCode.trim()}
            >
              Import List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Code Modal (using Dialog component) */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share List</DialogTitle>
            <DialogDescription>
              Copy and share this code with others to import your list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Input
                type="text"
                readOnly
                value={shareCode}
                className="pr-10 bg-gray-50"
              />
              <Button
                onClick={() => copyToClipboard(shareCode)}
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowShareModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Import Modal (using Dialog component) */}
      <Dialog open={showCsvImportModal} onOpenChange={setShowCsvImportModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import from CSV</DialogTitle>
            <DialogDescription>
              Select a CSV file to import a list with products and their details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="block text-sm font-medium mb-2">Select CSV File</Label>
              <Input
                type="file"
                accept=".csv"
                onChange={handleCsvFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
            </div>
            {csvFile && (
              <div className="text-sm text-gray-600">
                Selected file: {csvFile.name}
              </div>
            )}
            <div className="text-sm text-gray-500">
              <p className="mb-2">Expected CSV format:</p>
              <div className="bg-gray-50 p-3 rounded border font-mono text-xs">
                ListName<br/>
                Product1,category,image-url,comment<br/>
                Product2,category,image-url,comment
              </div>
            </div>
            {importError && (
              <p className="text-red-500 text-sm">
                {importError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCsvImportModal(false);
                setCsvContent("");
                setCsvFile(null);
                setImportError("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={importCsv}
              disabled={!csvFile}
            >
              Import List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
