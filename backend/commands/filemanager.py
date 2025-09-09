import os
import shutil
import mimetypes
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional, Any
import fnmatch

class FileManager:
    def __init__(self, base_path: str = None):
        """Initialize file manager with optional base path restriction for security."""
        self.base_path = os.path.abspath(base_path) if base_path else None
    
    def _validate_path(self, path: str) -> str:
        """Validate and normalize path, ensuring it's within allowed boundaries."""
        abs_path = os.path.abspath(path)
        
        # If base_path is set, ensure the path is within it
        if self.base_path and not abs_path.startswith(self.base_path):
            raise PermissionError(f"Access denied: Path outside allowed directory")
        
        return abs_path
    
    def list_directory(self, path: str, show_hidden: bool = False) -> Dict[str, Any]:
        """List contents of a directory with file information."""
        try:
            validated_path = self._validate_path(path)
            
            if not os.path.exists(validated_path):
                return {"error": "Directory does not exist", "files": [], "current_path": path}
            
            if not os.path.isdir(validated_path):
                return {"error": "Path is not a directory", "files": [], "current_path": path}
            
            files = []
            
            try:
                entries = os.listdir(validated_path)
            except PermissionError:
                return {"error": "Permission denied", "files": [], "current_path": path}
            
            for entry in entries:
                # Skip hidden files if not requested
                if not show_hidden and entry.startswith('.'):
                    continue
                
                entry_path = os.path.join(validated_path, entry)
                try:
                    stat = os.stat(entry_path)
                    is_dir = os.path.isdir(entry_path)
                    
                    file_info = {
                        "name": entry,
                        "type": "directory" if is_dir else "file",
                        "size": stat.st_size if not is_dir else None,
                        "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                        "permissions": oct(stat.st_mode)[-3:],
                        "is_hidden": entry.startswith('.'),
                        "mime_type": None if is_dir else mimetypes.guess_type(entry_path)[0]
                    }
                    
                    files.append(file_info)
                except (OSError, PermissionError):
                    # Skip files we can't access
                    continue
            
            # Sort: directories first, then files, both alphabetically
            files.sort(key=lambda x: (x["type"] != "directory", x["name"].lower()))
            
            return {
                "files": files,
                "current_path": validated_path,
                "parent_path": os.path.dirname(validated_path) if validated_path != "/" else None
            }
            
        except Exception as e:
            return {"error": str(e), "files": [], "current_path": path}
    
    def search_files(self, path: str, pattern: str, show_hidden: bool = False) -> Dict[str, Any]:
        """Search for files matching a pattern."""
        try:
            validated_path = self._validate_path(path)
            
            if not os.path.exists(validated_path):
                return {"error": "Directory does not exist", "results": []}
            
            results = []
            
            for root, dirs, files in os.walk(validated_path):
                # Remove hidden directories from search if not requested
                if not show_hidden:
                    dirs[:] = [d for d in dirs if not d.startswith('.')]
                
                all_items = dirs + files
                for item in all_items:
                    if not show_hidden and item.startswith('.'):
                        continue
                    
                    if fnmatch.fnmatch(item.lower(), pattern.lower()):
                        item_path = os.path.join(root, item)
                        try:
                            stat = os.stat(item_path)
                            is_dir = os.path.isdir(item_path)
                            
                            result = {
                                "name": item,
                                "path": item_path,
                                "relative_path": os.path.relpath(item_path, validated_path),
                                "type": "directory" if is_dir else "file",
                                "size": stat.st_size if not is_dir else None,
                                "modified": datetime.fromtimestamp(stat.st_mtime).isoformat()
                            }
                            results.append(result)
                        except (OSError, PermissionError):
                            continue
            
            return {"results": results, "pattern": pattern, "search_path": validated_path}
            
        except Exception as e:
            return {"error": str(e), "results": []}
    
    def create_file(self, file_path: str, content: str = "") -> Dict[str, Any]:
        """Create a new file with optional content."""
        try:
            validated_path = self._validate_path(file_path)
            
            if os.path.exists(validated_path):
                return {"error": "File already exists"}
            
            # Create parent directories if they don't exist
            os.makedirs(os.path.dirname(validated_path), exist_ok=True)
            
            with open(validated_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return {"message": f"File created successfully", "path": validated_path}
            
        except Exception as e:
            return {"error": str(e)}
    
    def create_directory(self, dir_path: str) -> Dict[str, Any]:
        """Create a new directory."""
        try:
            validated_path = self._validate_path(dir_path)
            
            if os.path.exists(validated_path):
                return {"error": "Directory already exists"}
            
            os.makedirs(validated_path)
            return {"message": f"Directory created successfully", "path": validated_path}
            
        except Exception as e:
            return {"error": str(e)}
    
    def move_item(self, source_path: str, destination_path: str) -> Dict[str, Any]:
        """Move a file or directory."""
        try:
            validated_source = self._validate_path(source_path)
            validated_dest = self._validate_path(destination_path)
            
            if not os.path.exists(validated_source):
                return {"error": "Source does not exist"}
            
            if os.path.exists(validated_dest):
                return {"error": "Destination already exists"}
            
            # Create parent directory if it doesn't exist
            os.makedirs(os.path.dirname(validated_dest), exist_ok=True)
            
            shutil.move(validated_source, validated_dest)
            return {"message": f"Moved successfully", "from": validated_source, "to": validated_dest}
            
        except Exception as e:
            return {"error": str(e)}
    
    def delete_item(self, item_path: str) -> Dict[str, Any]:
        """Delete a file or directory."""
        try:
            validated_path = self._validate_path(item_path)
            
            if not os.path.exists(validated_path):
                return {"error": "Item does not exist"}
            
            if os.path.isdir(validated_path):
                shutil.rmtree(validated_path)
                return {"message": f"Directory deleted successfully", "path": validated_path}
            else:
                os.remove(validated_path)
                return {"message": f"File deleted successfully", "path": validated_path}
                
        except Exception as e:
            return {"error": str(e)}
    
    def read_file(self, file_path: str, max_size: int = 1024 * 1024) -> Dict[str, Any]:
        """Read file content (with size limit for safety)."""
        try:
            validated_path = self._validate_path(file_path)
            
            if not os.path.exists(validated_path):
                return {"error": "File does not exist"}
            
            if not os.path.isfile(validated_path):
                return {"error": "Path is not a file"}
            
            file_size = os.path.getsize(validated_path)
            if file_size > max_size:
                return {"error": f"File too large (max {max_size} bytes)"}
            
            try:
                with open(validated_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                return {"content": content, "size": file_size, "encoding": "utf-8"}
            except UnicodeDecodeError:
                # Try reading as binary for non-text files
                with open(validated_path, 'rb') as f:
                    content = f.read()
                return {"content": content.hex(), "size": file_size, "encoding": "binary"}
                
        except Exception as e:
            return {"error": str(e)}
    
    def get_file_info(self, file_path: str) -> Dict[str, Any]:
        """Get detailed information about a file or directory."""
        try:
            validated_path = self._validate_path(file_path)
            
            if not os.path.exists(validated_path):
                return {"error": "Item does not exist"}
            
            stat = os.stat(validated_path)
            is_dir = os.path.isdir(validated_path)
            
            info = {
                "name": os.path.basename(validated_path),
                "path": validated_path,
                "type": "directory" if is_dir else "file",
                "size": stat.st_size if not is_dir else None,
                "created": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "accessed": datetime.fromtimestamp(stat.st_atime).isoformat(),
                "permissions": oct(stat.st_mode)[-3:],
                "is_hidden": os.path.basename(validated_path).startswith('.'),
                "mime_type": None if is_dir else mimetypes.guess_type(validated_path)[0]
            }
            
            if is_dir:
                try:
                    # Count items in directory
                    items = os.listdir(validated_path)
                    info["item_count"] = len(items)
                except PermissionError:
                    info["item_count"] = None
            
            return info
            
        except Exception as e:
            return {"error": str(e)}

# Create a global instance with home directory as base (for security)
# In production, you might want to restrict this further
file_manager = FileManager(base_path=os.path.expanduser("~"))
