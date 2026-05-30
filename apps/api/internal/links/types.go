package links

type CreateLinkRequest struct {
	Title       string `json:"title" validate:"required"`
	Description string `json:"description"`
	Url         string `json:"url" validate:"required,url"`
	IconURL     string `json:"icon_url"`
	Position    int    `json:"position" validate:"omitempty,min=0"`
	IsActive    bool   `json:"is_active" validate:"omitempty"`
}

type UpdateLinkRequest struct {
	Title       string `json:"title" validate:"omitempty,min=1"`
	Description string `json:"description" validate:"omitempty,min=1"`
	Url         string `json:"url" validate:"omitempty,url"`
	IconURL     string `json:"icon_url" validate:"omitempty,url"`
	Position    int    `json:"position" validate:"omitempty,min=0"`
	IsActive    bool   `json:"is_active" validate:"omitempty"`
}
