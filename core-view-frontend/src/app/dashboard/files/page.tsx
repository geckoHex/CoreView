'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fileAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Folder,
  File,
  FolderPlus,
  FilePlus,
  Eye,
  EyeOff,
  Home,
  ArrowLeft,
  RefreshCw,
  Trash2,
  HardDrive
} from 'lucide-react';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  modified: string;
  permissions: string;
  is_hidden: boolean;
  mime_type?: string;
}

interface FileManagerState {
  files: FileItem[];
  currentPath: string;
  parentPath?: string;
  loading: boolean;
  error: string;
  showHidden: boolean;
  selectedItems: Set<string>;
  showCreateModal: boolean;
  createType: 'file' | 'directory';
  newItemName: string;
  showMoveModal: boolean;
  moveDestination: string;
}

export default function FileManagerPage() {
  const [state, setState] = useState<FileManagerState>({
    files: [],
    currentPath: '',
    loading: true,
    error: '',
    showHidden: false,
    selectedItems: new Set(),
    showCreateModal: false,
    createType: 'file',
    newItemName: '',
    showMoveModal: false,
    moveDestination: ''
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef<number>(0);

  // Save scroll position before navigation
  const saveScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      lastScrollPosition.current = scrollContainerRef.current.scrollTop;
    }
  }, []);

  // Restore scroll position after content loads (for refresh operations)
  const restoreScrollPosition = useCallback(() => {
    if (scrollContainerRef.current && lastScrollPosition.current > 0) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = lastScrollPosition.current;
        }
      }, 100);
    }
  }, []);

  const updateState = useCallback((updates: Partial<FileManagerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const loadDirectory = useCallback(async (path?: string, preserveScroll = false) => {
    if (!preserveScroll) {
      // Only save scroll position if we're not preserving it (i.e., during navigation)
      saveScrollPosition();
    }
    
    updateState({ loading: true, error: '', selectedItems: new Set() });
    
    try {
      const result = await fileAPI.listFiles(path || state.currentPath || '', state.showHidden);
      updateState({
        files: result.files || [],
        currentPath: result.current_path || '',
        parentPath: result.parent_path,
        loading: false
      });
      
      if (preserveScroll) {
        restoreScrollPosition();
      }
    } catch {
      updateState({
        error: 'Failed to load directory',
        loading: false
      });
    }
  }, [state.currentPath, state.showHidden, updateState, saveScrollPosition, restoreScrollPosition]);

  const createItem = useCallback(async () => {
    if (!state.newItemName.trim()) return;
    
    const fullPath = `${state.currentPath}/${state.newItemName}`;
    
    try {
      if (state.createType === 'file') {
        await fileAPI.createFile(fullPath);
      } else {
        await fileAPI.createDirectory(fullPath);
      }
      
      updateState({
        showCreateModal: false,
        newItemName: ''
      });
      
      await loadDirectory(undefined, true);
    } catch {
      updateState({ error: `Failed to create ${state.createType}` });
    }
  }, [state.newItemName, state.currentPath, state.createType, updateState, loadDirectory]);

  const deleteSelected = useCallback(async () => {
    if (state.selectedItems.size === 0) return;
    
    if (!confirm(`Delete ${state.selectedItems.size} item(s)?`)) return;
    
    try {
      for (const itemName of state.selectedItems) {
        const fullPath = `${state.currentPath}/${itemName}`;
        await fileAPI.deleteItem(fullPath);
      }
      
      updateState({ selectedItems: new Set() });
      await loadDirectory(undefined, true);
    } catch {
      updateState({ error: 'Failed to delete items' });
    }
  }, [state.selectedItems, state.currentPath, updateState, loadDirectory]);

  const toggleItemSelection = useCallback((itemName: string) => {
    const newSelected = new Set(state.selectedItems);
    if (newSelected.has(itemName)) {
      newSelected.delete(itemName);
    } else {
      newSelected.add(itemName);
    }
    updateState({ selectedItems: newSelected });
  }, [state.selectedItems, updateState]);

  const navigateToPath = useCallback((path: string) => {
    loadDirectory(path);
  }, [loadDirectory]);

  const navigateUp = useCallback(() => {
    if (state.parentPath) {
      navigateToPath(state.parentPath);
    }
  }, [state.parentPath, navigateToPath]);

  const toggleHidden = useCallback(() => {
    updateState({ showHidden: !state.showHidden });
  }, [state.showHidden, updateState]);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'directory') {
      return <Folder className="w-5 h-5 text-blue-600" />;
    }
    
    const mimeType = item.mime_type || '';
    if (mimeType.startsWith('image/')) {
      return <File className="w-5 h-5 text-green-600" />;
    } else if (mimeType.startsWith('text/') || mimeType.includes('json') || mimeType.includes('xml')) {
      return <File className="w-5 h-5 text-gray-600" />;
    } else {
      return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  useEffect(() => {
    loadDirectory(undefined, false);
  }, [state.showHidden]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={scrollContainerRef} className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <Card className="flex-shrink-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HardDrive className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>File Manager</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Browse and manage system files</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleHidden}
                className="flex items-center space-x-2"
              >
                {state.showHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{state.showHidden ? 'Hide Hidden' : 'Show Hidden'}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  loadDirectory(undefined, true);
                }}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              Browse files and directories, create new items, and manage your file system. 
              Use the controls below to navigate and perform file operations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Bar */}
      <Card className="flex-shrink-0">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToPath('~');
                }}
                className="flex items-center space-x-1"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
              
              {state.parentPath && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateUp();
                  }}
                  className="flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Up</span>
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  updateState({ showCreateModal: true, createType: 'directory' });
                }}
                className="flex items-center space-x-1"
              >
                <FolderPlus className="w-4 h-4" />
                <span>New Folder</span>
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  updateState({ showCreateModal: true, createType: 'file' });
                }}
                className="flex items-center space-x-1"
              >
                <FilePlus className="w-4 h-4" />
                <span>New File</span>
              </Button>
              
              {state.selectedItems.size > 0 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteSelected();
                  }}
                  className="flex items-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete ({state.selectedItems.size})</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* Current Path */}
          <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm font-mono">
            {state.currentPath || '/'}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {state.error && (
        <Card className="flex-shrink-0">
          <CardContent className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{state.error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  updateState({ error: '' });
                }}
                className="mt-2"
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File List - This will take remaining space */}
      <Card className="flex-1 min-h-0 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Directory Contents</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 min-h-0 p-0">
          {state.loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          ) : (
            <div className="h-full overflow-hidden flex flex-col">
              <div className="overflow-x-auto flex-1">
                <table className="w-full h-full">
                  <thead className="sticky top-0 bg-white z-10 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 w-8 bg-white">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateState({ 
                                selectedItems: new Set(state.files.map(item => item.name))
                              });
                            } else {
                              updateState({ selectedItems: new Set() });
                            }
                          }}
                          checked={state.selectedItems.size > 0}
                        />
                      </th>
                      <th className="text-left py-3 px-4 bg-white">Name</th>
                      <th className="text-left py-3 px-4 bg-white">Size</th>
                      <th className="text-left py-3 px-4 bg-white">Modified</th>
                      <th className="text-left py-3 px-4 bg-white">Permissions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {state.files.map((item, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          state.selectedItems.has(item.name) ? 'bg-blue-50' : ''
                        } ${item.is_hidden ? 'opacity-60' : ''}`}
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={state.selectedItems.has(item.name)}
                            onChange={() => toggleItemSelection(item.name)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td 
                          className="py-3 px-4"
                          onClick={(e) => {
                            e.preventDefault();
                            if (item.type === 'directory') {
                              const newPath = `${state.currentPath}/${item.name}`;
                              navigateToPath(newPath);
                            }
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            {getFileIcon(item)}
                            <span className={`${item.is_hidden ? 'text-gray-500' : ''}`}>
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatFileSize(item.size)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(item.modified)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                          {item.permissions}
                        </td>
                      </tr>
                    ))}
                    
                    {state.files.length === 0 && !state.loading && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          This directory is empty
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      {state.showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New {state.createType === 'file' ? 'File' : 'Directory'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Name"
                value={state.newItemName}
                onChange={(e) => updateState({ newItemName: e.target.value })}
                placeholder={`Enter ${state.createType} name`}
                onKeyPress={(e) => e.key === 'Enter' && createItem()}
              />
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    updateState({ showCreateModal: false, newItemName: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    createItem();
                  }}
                  disabled={!state.newItemName.trim()}
                >
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
