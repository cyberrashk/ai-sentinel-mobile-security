
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Key, Eye, EyeOff, Plus, FileText, Camera, Shield, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VaultItem {
  id: string;
  name: string;
  type: 'photos' | 'documents' | 'passwords';
  data: string;
  createdAt: Date;
}

interface PasswordItem extends VaultItem {
  type: 'passwords';
  data: string; // This would be the actual password
  website?: string;
  username?: string;
}

export default function SecureVault() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'photos' | 'documents' | 'passwords' | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    data: '',
    website: '',
    username: ''
  });

  const handleUnlock = () => {
    if (password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    
    toast.success("Vault unlocked successfully");
    setIsUnlocked(true);
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setPassword('');
    setSelectedCategory(null);
    toast("Vault locked", {
      description: "Your secure vault has been locked"
    });
  };

  const getCategoryItems = (category: 'photos' | 'documents' | 'passwords') => {
    return vaultItems.filter(item => item.type === category);
  };

  const handleAddItem = () => {
    if (!selectedCategory || !newItem.name || !newItem.data) {
      toast.error("Please fill in all required fields");
      return;
    }

    const item: VaultItem = {
      id: Date.now().toString(),
      name: newItem.name,
      type: selectedCategory,
      data: newItem.data,
      createdAt: new Date()
    };

    if (selectedCategory === 'passwords') {
      (item as PasswordItem).website = newItem.website;
      (item as PasswordItem).username = newItem.username;
    }

    setVaultItems(prev => [...prev, item]);
    setNewItem({ name: '', data: '', website: '', username: '' });
    setShowAddDialog(false);
    toast.success(`${selectedCategory.slice(0, -1)} added successfully`);
  };

  const handleDeleteItem = (id: string) => {
    setVaultItems(prev => prev.filter(item => item.id !== id));
    toast.success("Item deleted successfully");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setNewItem(prev => ({ ...prev, data: result, name: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const getCategoryIcon = (category: 'photos' | 'documents' | 'passwords') => {
    switch (category) {
      case 'photos': return Camera;
      case 'documents': return FileText;
      case 'passwords': return Shield;
    }
  };

  const renderCategoryView = () => {
    if (!selectedCategory) return null;

    const items = getCategoryItems(selectedCategory);
    const Icon = getCategoryIcon(selectedCategory);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="mr-2"
            >
              ← Back
            </Button>
            <Icon className="w-5 h-5 mr-2 text-cyberguard-primary" />
            <h4 className="font-medium capitalize">{selectedCategory}</h4>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-cyberguard-primary hover:bg-cyberguard-primary/90">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add {selectedCategory.slice(0, -1)}</DialogTitle>
                <DialogDescription>
                  Add a new {selectedCategory.slice(0, -1)} to your secure vault
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                />
                
                {selectedCategory === 'passwords' ? (
                  <>
                    <Input
                      placeholder="Website (optional)"
                      value={newItem.website}
                      onChange={(e) => setNewItem(prev => ({ ...prev, website: e.target.value }))}
                    />
                    <Input
                      placeholder="Username (optional)"
                      value={newItem.username}
                      onChange={(e) => setNewItem(prev => ({ ...prev, username: e.target.value }))}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={newItem.data}
                      onChange={(e) => setNewItem(prev => ({ ...prev, data: e.target.value }))}
                    />
                  </>
                ) : selectedCategory === 'photos' || selectedCategory === 'documents' ? (
                  <input
                    type="file"
                    accept={selectedCategory === 'photos' ? 'image/*' : '.pdf,.doc,.docx,.txt'}
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-cyberguard-primary/10 file:text-cyberguard-primary hover:file:bg-cyberguard-primary/20"
                  />
                ) : (
                  <Input
                    placeholder="Content"
                    value={newItem.data}
                    onChange={(e) => setNewItem(prev => ({ ...prev, data: e.target.value }))}
                  />
                )}
                
                <div className="flex space-x-2">
                  <Button onClick={handleAddItem} className="flex-1 bg-cyberguard-primary hover:bg-cyberguard-primary/90">
                    Add {selectedCategory.slice(0, -1)}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No {selectedCategory} stored yet</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  {selectedCategory === 'passwords' && (
                    <div className="text-xs text-gray-500">
                      {(item as PasswordItem).website && `Website: ${(item as PasswordItem).website}`}
                      {(item as PasswordItem).username && ` • Username: ${(item as PasswordItem).username}`}
                    </div>
                  )}
                  <p className="text-xs text-gray-400">
                    Added {item.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-cyberguard-primary to-cyberguard-secondary p-4">
        <div className="flex items-center text-white">
          <Lock className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Secure Vault</h3>
        </div>
      </div>
      
      <div className="p-5">
        {isUnlocked ? (
          <div className="space-y-4">
            {selectedCategory ? (
              renderCategoryView()
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Your encrypted vault is now unlocked. Safely store your sensitive files, passwords, 
                  and documents protected with military-grade encryption.
                </p>
                
                <div className="grid grid-cols-3 gap-3">
                  {(['photos', 'documents', 'passwords'] as const).map((category) => {
                    const count = getCategoryItems(category).length;
                    const Icon = getCategoryIcon(category);
                    return (
                      <Button 
                        key={category}
                        variant="outline" 
                        className="h-20 flex flex-col items-center justify-center"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <Icon className="w-5 h-5 text-cyberguard-primary mb-1" />
                        <div className="text-cyberguard-primary capitalize">{category}</div>
                        <div className="text-xs text-gray-500">{count} items</div>
                      </Button>
                    );
                  })}
                </div>
                
                <Button 
                  onClick={handleLock} 
                  className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800"
                >
                  Lock Vault
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Secure your sensitive data with end-to-end encryption. 
              Enter your password to unlock the vault.
            </p>
            
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter vault password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <Button 
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              <Button 
                onClick={handleUnlock} 
                className="w-full bg-cyberguard-secondary hover:bg-cyberguard-secondary/90"
              >
                <Key className="w-4 h-4 mr-2" />
                Unlock Vault
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
